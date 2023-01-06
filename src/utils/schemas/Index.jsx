import * as yup from "yup";

export const basicSchema = yup.object().shape({
  title: yup.string().required("Required*"),
  slug: yup.string().required("Required*"),
  shortDesc: yup.string().required("Required*"),
  description: yup.string().required("Required*"),
  downloadLink: yup.string().required("Required*"),
});

