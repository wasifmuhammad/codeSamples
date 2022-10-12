import React, { useEffect, useState } from "react";
import {
  FeeManagementTextView,
  GenericFeeManagementDialog,
  LabelledTextField,
} from "@components/molecules";
import { Box, Divider, Grid, InputAdornment } from "@mui/material";
import { ErrorMessage, FilterSelect, TextValueSelect } from "@components/atoms";
import { filterOptions, getCountry, getCurrencySign } from "@utils";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDepositFeeSchema } from "./deposit-add-fees-modal-schema";
import { TextFieldLabel } from "../../inputs/labelled-text-field/labelled-text-field.styles";
export const DepositAddFeesDialogContent = ({
  showDialog,
  setShowDialog,
  size,
  setFormData,
  setShowReasonDialog,
  heading,
  formData,
  isEditing = false,
  activeCountries,
}: {
  showDialog: boolean;
  setShowDialog: any;
  size: "xs" | "sm" | "lg" | "md" | "xl";
  setFormData: any;
  setShowReasonDialog: any;
  heading: string;
  formData: any;
  isEditing?: boolean;
  activeCountries: any[];
}): JSX.Element => {
  const [paymentGatwayOptions, setPaymentGatwayOptions] = useState<any[]>([]);
  const [currencySign, setCurrencySign] = useState<string | undefined>("$");
  const handleReqFeeChange = () => {
    console.log("ChangeRequested");
  };
  const whoPaysOptions = [
    { ID: "Cashero", Name: "Cashero" },
    { ID: "User", Name: "User" },
  ];

  const paymentProviderOptions = [
    { ID: "rapyd", Name: "Rapyd" },
    { ID: "transfero", Name: "Transfero" },
    { ID: "currencyCloud", Name: "Currency Cloud" },
  ];

  const paymentMethodOptions = {
    rapyd: [
      { ID: "BANK", Name: "Bank" },
      { ID: "CASH", Name: "Cash" },
      { ID: "EWALLET", Name: "EWallet" },
    ],
    transfero: [
      { ID: "TED", Name: "TED" },
      { ID: "PIX", Name: "PIX" },
    ],
    currencyCloud: [
      { ID: "priority", Name: "Priority" },
      { ID: "regular", Name: "Regular" },
    ],
  };

  const currencyOptions = [
    { ID: "USD", Name: "USD" },
    { ID: "EUR", Name: "EUR" },
    { ID: "GBP", Name: "GBP" },
  ];

  const defaultValues = {
    country: null as any,
    currency: null as any,
    whoPays: null,
    fxSpread: "",
    expectedDeposit: "",
    paymentMethod: null,
    paymentProvider: null as any,
    minimumDeposit: "",
  };

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm({
    defaultValues,
    resolver: yupResolver(addDepositFeeSchema),
    mode: "onChange",
  });

  const getCapitalized = (input: string): string => {
    return input[0].toUpperCase() + String(input.slice(1)).toLowerCase();
  };

  React.useEffect(() => {
    if (showDialog && isEditing) {
      reset({
        country: getCountry(formData[0]?.country) as any,
        currency: {
          label: formData[0]?.currency,
          value: formData[0]?.currency,
        } as any,
        whoPays: {
          label: formData[0]?.payer,
          value: formData[0]?.payer,
        } as any,
        fxSpread: formData[0]?.fxSpread,
        expectedDeposit: formData[0]?.fee,
        paymentMethod: {
          label: formData[0]?.paymentMethod,
          value: formData[0]?.paymentMethod,
        } as any,
        paymentProvider: {
          label: getCapitalized(formData[0]?.paymentGateway),
          value: formData[0]?.paymentGateway,
        } as any,
        minimumDeposit: formData[0]?.minimumAmount,
      });
      setPaymentMethodOptions(getValues().paymentProvider);
    } else {
      reset(defaultValues);
    }
  }, [showDialog]);

  const handleFormSubmit = () => {
    setFormData(getValues());
    setShowDialog(false);
    setShowReasonDialog(true);
  };

  const setPaymentMethodOptions = (e: any) => {
    if (e == null) {
      setPaymentGatwayOptions([]);
      return;
    } else if (e.value.toLowerCase() == "rapyd")
      setPaymentGatwayOptions(paymentMethodOptions.rapyd);
    else if (e.value.toLowerCase() == "transfero")
      setPaymentGatwayOptions(paymentMethodOptions.transfero);
    else setPaymentGatwayOptions(paymentMethodOptions.currencyCloud);
  };

  const getCurrencySignByType = (e: any) => {
    const currency: any = e?.value;
    if (!currency) {
      return setCurrencySign("$");
    }
    return setCurrencySign(getCurrencySign(currency));
  };

  return (
    <GenericFeeManagementDialog
      size={1030}
      showDialog={showDialog}
      toogleDialog={setShowDialog}
      heading={heading}
      buttonText={isEditing ? "Request Fee Change" : "Request Add Fees"}
      buttonAction={handleSubmit(handleFormSubmit)}
      disable={!isValid || !isDirty}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container rowSpacing={2} columnSpacing={4}>
          {isEditing ? (
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextFieldLabel>Country</TextFieldLabel>
              <FeeManagementTextView
                text={String(getValues()?.country?.label)}
              />
            </Grid>
          ) : (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Controller
                {...{ control }}
                name="country"
                render={({
                  field: { ref, onChange, onBlur, value, name },
                  fieldState: { invalid, isTouched, isDirty, error },
                  formState,
                }) => (
                  <FilterSelect
                    placeholder="Select"
                    height={10}
                    loading={false}
                    data={activeCountries}
                    fullWidth
                    hasRadius={false}
                    isDisabled={isEditing}
                    label="Country"
                    margin="normal"
                    select
                    id="country"
                    SelectProps={{ native: true }}
                    variant="outlined"
                    {...{
                      onChange,
                      onBlur,
                      value,
                      name,
                    }}
                    inputRef={ref}
                  />
                )}
              />

              {errors.country && (
                <Box sx={{ marginTop: "5px" }}>
                  <ErrorMessage message={`${errors.country.message}`} />
                </Box>
              )}
            </Grid>
          )}

          {isEditing ? (
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextFieldLabel>Currency</TextFieldLabel>
              <FeeManagementTextView
                text={String(getValues()?.currency?.label)}
              />
            </Grid>
          ) : (
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <Controller
                {...{ control }}
                name="currency"
                render={({
                  field: { ref, onChange, onBlur, value, name },
                  fieldState: { invalid, isTouched, isDirty, error },
                  formState,
                }) => (
                  <TextValueSelect
                    placeholder="Select"
                    h={135}
                    isLoading={false}
                    data={currencyOptions}
                    fullWidth
                    label="Currency"
                    margin="normal"
                    // onChange={(val: SelectProps) => { onChange(val); getRolesByDepartment(val); setSelectedDepartment(val); reset({ ...getValues(), role: "" }) }}
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                    id="currency"
                    onChange={(e: any) => {
                      getCurrencySignByType(e);
                      onChange(e);
                    }}
                    {...{
                      onBlur,
                      value,
                      name,
                    }}
                    inputRef={ref}
                  />
                )}
              />
              {errors.currency && (
                <Box sx={{ marginTop: "5px" }}>
                  <ErrorMessage message={`${errors.currency.message}`} />
                </Box>
              )}
            </Grid>
          )}

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Controller
              {...{ control }}
              name="paymentProvider"
              render={({
                field: { ref, onChange, onBlur, value, name },
                fieldState: { invalid, isTouched, isDirty, error },
                formState,
              }) => (
                <TextValueSelect
                  placeholder="Select"
                  h={135}
                  isLoading={false}
                  data={paymentProviderOptions}
                  fullWidth
                  label="Payment Provider"
                  margin="normal"
                  onChange={(e: any) => {
                    onChange(e);
                    setPaymentMethodOptions(e);
                    setValue("paymentMethod", null);
                  }}
                  // onChange={(val: SelectProps) => { onChange(val); getRolesByDepartment(val); setSelectedDepartment(val); reset({ ...getValues(), role: "" }) }}
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  id="paymentProvider"
                  {...{
                    onBlur,
                    value,
                    name,
                  }}
                  inputRef={ref}
                />
              )}
            />
            {errors.paymentProvider && (
              <Box sx={{ marginTop: "5px" }}>
                <ErrorMessage message={`${errors.paymentProvider.message}`} />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Controller
              {...{ control }}
              name="paymentMethod"
              render={({
                field: { ref, onChange, onBlur, value, name },
                fieldState: { invalid, isTouched, isDirty, error },
                formState,
              }) => (
                <TextValueSelect
                  placeholder="Enter Payment Method"
                  h={135}
                  isLoading={false}
                  data={paymentGatwayOptions}
                  fullWidth
                  label="Payment Method"
                  margin="normal"
                  height={41}
                  // onChange={(val: SelectProps) => { onChange(val); getRolesByDepartment(val); setSelectedDepartment(val); reset({ ...getValues(), role: "" }) }}
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  id="paymentMethod"
                  {...{
                    onChange,
                    onBlur,
                    value,
                    name,
                  }}
                  inputRef={ref}
                />
              )}
            />
            {errors.paymentMethod && (
              <Box sx={{ marginTop: "5px" }}>
                <ErrorMessage message={`${errors.paymentMethod.message}`} />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Controller
              {...{ control }}
              name="minimumDeposit"
              render={({
                field: { ref, onChange, onBlur, value, name },
                fieldState: { invalid, isTouched, isDirty, error },
                formState,
              }) => (
                <LabelledTextField
                  label="Minimum Deposit"
                  margin="normal"
                  fullWidth
                  id="minimumDeposit"
                  {...{
                    onChange,
                    onBlur,
                    value,
                    name,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <p style={{ color: "#9EA0A5" }}>{currencySign}</p>
                      </InputAdornment>
                    ),
                  }}
                  inputRef={ref}
                />
              )}
            />
            {errors.minimumDeposit && (
              <Box sx={{ marginTop: "5px" }}>
                <ErrorMessage message={`${errors.minimumDeposit.message}`} />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Controller
              {...{ control }}
              name="fxSpread"
              render={({
                field: { ref, onChange, onBlur, value, name },
                fieldState: { invalid, isTouched, isDirty, error },
                formState,
              }) => (
                <LabelledTextField
                  label="FX Spread"
                  placeholder="Enter Deposit Fee"
                  margin="normal"
                  fullWidth
                  id="fxSpread"
                  {...{
                    onChange,
                    onBlur,
                    value,
                    name,
                  }}
                  inputRef={ref}
                />
              )}
            />
            {errors.fxSpread && (
              <Box sx={{ marginTop: "5px" }}>
                <ErrorMessage message={`${errors.fxSpread.message}`} />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Controller
              {...{ control }}
              name="expectedDeposit"
              render={({
                field: { ref, onChange, onBlur, value, name },
                fieldState: { invalid, isTouched, isDirty, error },
                formState,
              }) => (
                <LabelledTextField
                  label="Expected Deposit Fees"
                  placeholder="Enter Deposit Fee"
                  margin="normal"
                  fullWidth
                  id="expectedDeposit"
                  {...{
                    onChange,
                    onBlur,
                    value,
                    name,
                  }}
                  inputRef={ref}
                />
              )}
            />
            {errors.expectedDeposit && (
              <Box sx={{ marginTop: "5px" }}>
                <ErrorMessage message={`${errors.expectedDeposit.message}`} />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Controller
              {...{ control }}
              name="whoPays"
              render={({
                field: { ref, onChange, onBlur, value, name },
                fieldState: { invalid, isTouched, isDirty, error },
                formState,
              }) => (
                <TextValueSelect
                  placeholder="Select"
                  h={135}
                  isLoading={false}
                  data={whoPaysOptions}
                  height={41}
                  fullWidth
                  label="Who Pays"
                  margin="normal"
                  // onChange={(val: SelectProps) => { onChange(val); getRolesByDepartment(val); setSelectedDepartment(val); reset({ ...getValues(), role: "" }) }}
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  id="whoPays"
                  {...{
                    onChange,
                    onBlur,
                    value,
                    name,
                  }}
                  inputRef={ref}
                />
              )}
            />
            {errors.whoPays && (
              <Box sx={{ marginTop: "5px" }}>
                <ErrorMessage message={`${errors.whoPays.message}`} />
              </Box>
            )}
          </Grid>
        </Grid>
      </form>
    </GenericFeeManagementDialog>
  );
};
