const commonFields = `
  $ownerId: String,
  $description: String,
  $doNotDisturb: String,
  $customFieldsData: JSON,

  $plateNumber: String,
  $vinNumber: String,
  $colorCode: String,

  $manufactureBrand: String,
  $bodyType: String,
  $fuelType: String,
  $modelsName: String,
  $series: String,
  $gearBox: String,

  $vintageYear: Int,
  $importYear: Int
`;

const commonVariables = `
  ownerId: $ownerId,
  description: $description,
  doNotDisturb: $doNotDisturb,
  customFieldsData: $customFieldsData,

  plateNumber: $plateNumber,
  vinNumber: $vinNumber,
  colorCode: $colorCode,

  manufactureBrand: $manufactureBrand,
  bodyType: $bodyType,
  fuelType: $fuelType,
  modelsName: $modelsName,
  series: $series,
  gearBox: $gearBox,

  vintageYear: $vintageYear,
  importYear: $importYear
`;

const carsAdd = `
  mutation carsAdd(${commonFields}) {
    carsAdd(${commonVariables}) {
      _id
      plateNumber
      vinNumber
      colorCode
      manufactureBrand
      bodyType
      fuelType
      modelsName
      series
      gearBox
      vintageYear
      importYear
    }
  }
`;

const carsEdit = `
  mutation carsEdit($_id: String!, ${commonFields}) {
    carsEdit(_id: $_id, ${commonVariables}) {
      ownerId,
      description,
      doNotDisturb,
      plateNumber,
      vinNumber,
      colorCode,
      manufactureBrand,
      bodyType,
      fuelType,
      modelsName,
      series,
      gearBox,
      vintageYear,
      importYear
    }
  }
`;

const carsRemove = `
  mutation carsRemove($carIds: [String]) {
    carsRemove(carIds: $carIds)
  }
`;

const carsMerge = `
  mutation carsMerge($carIds: [String], $carFields: JSON) {
    carsMerge(carIds: $carIds, carFields: $carFields) {
      _id
    }
  }
`;

export default {
  carsAdd,
  carsEdit,
  carsRemove,
  carsMerge
};
