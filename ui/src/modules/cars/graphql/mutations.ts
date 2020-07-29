const commonFields = `
  $names: [String],
  $avatar: String,
  $primaryName: String,
  $size: Int,
  $industry: String,
  $parentCarId: String,
  $emails: [String],
  $primaryEmail: String,
  $ownerId: String,
  $phones: [String],
  $primaryPhone: String,
  $businessType: String,
  $description: String,
  $doNotDisturb: String,
  $links: JSON,
  $customFieldsData: JSON,
  $code: String
`;

const commonVariables = `
  names: $names,
  avatar: $avatar,
  primaryName: $primaryName,
  size: $size,
  industry: $industry,
  parentCarId: $parentCarId,
  emails: $emails,
  primaryEmail: $primaryEmail,
  ownerId: $ownerId,
  phones: $phones,
  primaryPhone: $primaryPhone,
  businessType: $businessType,
  description: $description,
  doNotDisturb: $doNotDisturb,
  links: $links,
  customFieldsData: $customFieldsData,
  code: $code
`;

const carsAdd = `
  mutation carsAdd(${commonFields}) {
    carsAdd(${commonVariables}) {
      _id
      primaryName
      primaryEmail
    }
  }
`;

const carsEdit = `
  mutation carsEdit($_id: String!, ${commonFields}) {
    carsEdit(_id: $_id, ${commonVariables}) {
      avatar
      primaryName
      names
      size
      industry
      plan
      parentCarId
      emails
      primaryEmail
      ownerId
      phones
      primaryPhone
      businessType
      description
      doNotDisturb
      code
      links
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
