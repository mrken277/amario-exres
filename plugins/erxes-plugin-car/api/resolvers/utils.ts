
/**
 * Checking if car has duplicated unique properties
 */
const checkDuplication = async (
  models,
  carFields: {
    plateNumber?: string;
    vinNumber?: string;
  },
  idsToExclude?: string[] | string,
) => {
  const query: { status: {};[key: string]: any } = { status: { $ne: 'deleted' } };
  let previousEntry;

  // Adding exclude operator to the query
  if (idsToExclude) {
    query._id = { $nin: idsToExclude };
  }

  if (carFields.plateNumber) {
    // check duplication from primaryName
    previousEntry = await models.Cars.find({
      ...query,
      plateNumber: carFields.plateNumber,
    });

    if (previousEntry.length > 0) {
      throw new Error('Duplicated plate number');
    }
  }

  if (carFields.vinNumber) {
    // check duplication from code
    previousEntry = await models.Cars.find({
      ...query,
      vinNumber: carFields.vinNumber,
    });

    if (previousEntry.length > 0) {
      throw new Error('Duplicated VIN number');
    }
  }
}

const fillSearchText = (doc) => {
  const value = [
    doc.plateNumber || '',
    doc.vinNumber || '',
    doc.description || '',
    doc.categoryId || ''
  ].join(' ');

  if (value.length < 512) {
    return value;
  }

  return value.substring(0, 511);
}

const getCarName = (car) => {
  return car.plateNumber || car.vinNumber || 'Unknown';
}

/**
 * Retreives car
 */
export const getCar = async (models, _id: string) => {
  const car = await models.Cars.findOne({ _id });

  if (!car) {
    throw new Error('Car not found');
  }

  return car;
}

/**
 * Create a car
 */
export const createCar = async (models, doc, user) => {
  // Checking duplicated fields of car
  await checkDuplication(models, doc);

  if (!doc.ownerId && user) {
    doc.ownerId = user._id;
  }

  const car = await models.Cars.create({
    ...doc,
    createdAt: new Date(),
    modifiedAt: new Date(),
    searchText: fillSearchText(doc),
  });

  // create log
  await models.ActivityLogs.createCocLog({ coc: car, contentType: 'car' });

  return car;
}

/**
 * Update car
 */
export const updateCar = async (models, _id: string, doc) => {
  // Checking duplicated fields of car
  await models.Cars.checkDuplication(doc, [_id]);

  const searchText = fillSearchText(Object.assign(await getCar(models, _id), doc));

  await models.Cars.updateOne({ _id }, { $set: { ...doc, searchText, modifiedAt: new Date() } });

  return models.Cars.findOne({ _id });
}

/**
 * Remove car
 */
export const removeCars = async (models, carIds: string[]) => {
  // Removing modules associated with car
  await models.InternalNotes.removeCarsInternalNotes(carIds);

  for (const carId of carIds) {
    await models.Conformities.removeConformity({ mainType: 'car', mainTypeId: carId });
  }

  return models.Cars.deleteMany({ _id: { $in: carIds } });
}

/**
 * Merge cars
 */
export const mergeCars = async (models, carIds: string[], carFields) => {
  // Checking duplicated fields of car
  await checkDuplication(models, carFields, carIds);

  let scopeBrandIds: string[] = [];
  let tagIds: string[] = [];
  let names: string[] = [];
  let emails: string[] = [];
  let phones: string[] = [];

  // Merging car tags
  for (const carId of carIds) {
    const carObj = await models.Cars.getCar(carId);

    const carTags = carObj.tagIds || [];
    const carScopeBrandIds = carObj.scopeBrandIds || [];

    // Merging scopeBrandIds
    scopeBrandIds = scopeBrandIds.concat(carScopeBrandIds);

    // Merging car's tag into 1 array
    tagIds = tagIds.concat(carTags);

    carObj.status = 'deleted';

    await models.Cars.findByIdAndUpdate(carId, { $set: { status: 'deleted' } });
  }

  // Removing Duplicates
  tagIds = Array.from(new Set(tagIds));
  names = Array.from(new Set(names));
  emails = Array.from(new Set(emails));
  phones = Array.from(new Set(phones));

  // Creating car with properties
  const car = await models.Cars.createCar({
    ...carFields,
    scopeBrandIds,
    tagIds,
    mergedIds: carIds,
  });

  // Updating customer cars, deals, tasks, tickets
  await models.Conformities.changeConformity({ type: 'car', newTypeId: car._id, oldTypeIds: carIds });

  // Removing modules associated with current cars
  await models.InternalNotes.changeCar(car._id, carIds);

  return car;
}

/**
 * Generating order
 */
const generateOrder = async (parentCategory, doc) => {
  const order = parentCategory ? `${parentCategory.order}/${doc.name}${doc.code}` : `${doc.name}${doc.code}`;

  return order;
}

/**
 *
 * Get Car Cagegory
 */

export const getCarCatogery = async (models, selector: any) => {
  const carCategory = await models.CarCategories.findOne(selector);

  if (!carCategory) {
    throw new Error('Car & service category not found');
  }

  return carCategory;
}

/**
 * Create a car categories
 */
export const createCarCategory = async (models, doc) => {
  const parentCategory = await models.CarCategories.findOne({ _id: doc.parentId }).lean();

  // Generatingg order
  doc.order = await generateOrder(parentCategory, doc);

  return models.CarCategories.create(doc);
}

/**
 * Update Car category
 */
export const updateCarCategory = async (models, _id: string, doc) => {
  const parentCategory = await models.CarCategories.findOne({ _id: doc.parentId }).lean();

  if (parentCategory && parentCategory.parentId === _id) {
    throw new Error('Cannot change category');
  }

  // Generatingg  order
  doc.order = await generateOrder(parentCategory, doc);

  const carCategory = await models.CarCategories.getCarCatogery({ _id });

  const childCategories = await models.CarCategories.find({
    $and: [{ order: { $regex: new RegExp(carCategory.order, 'i') } }, { _id: { $ne: _id } }],
  });

  await models.CarCategories.updateOne({ _id }, { $set: doc });

  // updating child categories order
  childCategories.forEach(async category => {
    let order = category.order;

    order = order.replace(carCategory.order, doc.order);

    await models.CarCategories.updateOne({ _id: category._id }, { $set: { order } });
  });

  return models.CarCategories.findOne({ _id });
}

/**
 * Remove Car category
 */
export const removeCarCategory = async (models, _id: string) => {
  await models.CarCategories.getCarCatogery({ _id });

  let count = await models.Cars.countDocuments({ categoryId: _id });
  count += await models.CarCategories.countDocuments({ parentId: _id });

  if (count > 0) {
    throw new Error("Can't remove a car category");
  }

  return models.CarCategories.deleteOne({ _id });
}
