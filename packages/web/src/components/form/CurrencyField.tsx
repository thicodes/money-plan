import React from 'react';
import { Rifm } from 'rifm';
import TextField, { Props } from './TextField';

const formatFloatingPointNumber = (value: string, maxDigits: number) => {
  const parsed = parseNumber(value);
  const [head, tail] = parsed.split('.');
  // Avoid rounding errors at toLocaleString as when user enters 1.239 and maxDigits=2 we
  // must not to convert it to 1.24, it must stay 1.23
  const scaledTail = tail != null ? tail.slice(0, maxDigits) : '';

  const number = Number.parseFloat(`${head}.${scaledTail}`);

  if (Number.isNaN(number)) {
    return '';
  }

  const formatted = number.toLocaleString('de-CH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDigits,
  });

  if (parsed.includes('.')) {
    const [formattedHead] = formatted.split('.');

    // skip zero at digits position for non fixed floats
    // as at digits 2 for non fixed floats numbers like 1.50 has no sense, just 1.5 allowed
    // but 1.0 has sense as otherwise you will not be able to enter 1.05 for example
    const formattedTail = scaledTail !== '' && scaledTail[maxDigits - 1] === '0' ? scaledTail.slice(0, -1) : scaledTail;

    return `${formattedHead}.${formattedTail}`;
  }
  return formatted;
};

const numberAccept = /[\d.]+/g;

const parseNumber = (string: string) => (string.match(numberAccept) || []).join('');

const formatCurrency = (string: string) => '$' + formatFloatingPointNumber(string, 2);

const CurrencyField = (props: Props) => {
  const { name, value, onChange, ...rest } = props;

  return (
    <Rifm
      // $ need to be in regexp to prevent cursor jumping on backspace
      accept={/[\d.$]/g}
      format={formatCurrency}
      value={value}
      onChange={(value: string) => parseNumber(value)}
    >
      {({ value, onChange }) => <input name={name} value={value} onChange={onChange} {...rest} />}
    </Rifm>
  );
};

export default CurrencyField;
