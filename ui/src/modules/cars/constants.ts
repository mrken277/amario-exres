import { getConstantFromStore } from 'modules/common/utils';

export const CAR_INFO = {
  description: 'Description',
  doNotDisturb: 'Do not disturb',

  plateNumber: 'Plate number',
  vinNumber: 'Vin number',
  colorCode: 'Color',
  bodyType: 'Body type',
  fuelType: 'Fuel type',
  gearBox: 'Gear box',
  vintageYear: 'Vintage year',
  importYear: 'Import year',

  ALL: [
    { field: 'plateNumber', label: 'Plate number' },
    { field: 'vinNumber', label: 'Vin number' },
    { field: 'colorCode', label: 'Color' },

    { field: 'bodyType', label: 'Body type' },
    { field: 'fuelType', label: 'Fuel type' },
    { field: 'gearBox', label: 'Gear box' },
    { field: 'vintageYear', label: 'Vintage year' },
    { field: 'importYear', label: 'Import year' },
    { field: 'description', label: 'Description' },
    { field: 'doNotDisturb', label: 'Do not disturb' }
  ]
};

export const CAR_DATAS = {
  owner: 'Owner',
  category: 'Category',

  ALL: [
    { field: 'owner', label: 'Owner' },
    { field: 'category', label: 'Category' }
  ]
};

export const CAR_BODY_TYPES = () => {
  return getConstantFromStore('car_body_types', false, true);
};

export const CAR_FUEL_TYPES = () => {
  return getConstantFromStore('car_fuel_types', false, true);
};

export const CAR_GEAR_BOXS = () => {
  return getConstantFromStore('car_gear_boxs', false, true);
};
