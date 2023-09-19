import { MapAddress } from "../interfaces";

export function toAddress(address: string | MapAddress): string {
  if (typeof (address) === 'string') {
    return address;
  }

  if (typeof address === 'object') {
    return [
      `${address.street || ''}`.trim(),
      `${address.city || ''}`.trim(),
      `${address.region || ''}`.trim(),
      `${address.zip || ''}`.trim(),
      `${address.country || ''}`.trim(),
    ]
      .filter((value) => !!value.length)
      .join(',');
  }

  return '';
}