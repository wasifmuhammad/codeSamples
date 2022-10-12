import * as yup from 'yup'

export const addDepositFeeSchema = yup
  .object({
    country: yup.object().nullable().required('This field is required'),
    currency: yup.object().nullable().required('This field is required'),

    paymentProvider: yup.object().nullable().required('This field is required'),
    paymentMethod: yup.object().nullable().required('This field is required'),
    minimumDeposit: yup
      .number()
      .typeError('Only numbers allowed')
      .required('This field is required'),
    expectedDeposit: yup
      .number()
      .typeError('Only numbers allowed')
      .required('This field is required'),
    fxSpread: yup
      .number()
      .typeError('Only numbers allowed')
      .required('This field is required'),
    whoPays: yup.object().nullable().required('This field is required')
  })
  .required()
