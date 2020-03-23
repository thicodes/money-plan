import React from 'react';
import TextFieldMaterial from '@material-ui/core/TextField';
import { useField } from 'formik';

type Props = {
  name: string;
  value: string;
  onChange: () => void;
};

export const TextField = (props: Props) => {
  const { name, value, onChange, ...rest } = props;

  return <TextFieldMaterial name={name} onChange={onChange} value={value} {...rest} />;
};

export default React.memo(TextField);
