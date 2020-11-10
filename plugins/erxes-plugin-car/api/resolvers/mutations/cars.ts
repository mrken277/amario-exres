import { createCar, createCarCategory, getCar, getCarCatogery, mergeCars, removeCars, updateCar, updateCarCategory } from "../utils";

const carMutations = [
  {
    name: 'carsAdd',
    handler: async (_root, doc, { user, docModifier, models }) => {
      const car = createCar(models, docModifier(doc), user)

      // await putCreateLog(
      //   {
      //     type: constants.MODULE_NAMES.CAR,
      //     newData: doc,
      //     object: car,
      //   },
      //   user,
      // );

      return car;
    }
  },
  /**
   * Updates a car
   */
  {
    name: 'carsEdit',
    handler: async (_root, { _id, ...doc }, { user, models }) => {
      await getCar(models, _id);
      const updated = await updateCar(models, _id, doc);

      // await putUpdateLog(
      //   {
      //     type: MODULE_NAMES.COMPANY,
      //     object: car,
      //     newData: doc,
      //     updatedDocument: updated,
      //   },
      //   user,
      // );

      return updated;
    }
  },

  /**
   * Removes cars
   */
  {
    name: 'carsRemove',
    handler: async (_root, { carIds }: { carIds: string[] }, { user, models }) => {
      const cars = await models.Cars.find({ _id: { $in: carIds } }).lean();

      await removeCars(models, carIds);

      // for (const car of cars) {
      //   await putDeleteLog({ type: MODULE_NAMES.COMPANY, object: car }, user);
      // }

      return carIds;
    }
  },

  /**
   * Merge cars
   */
  {
    name: 'carsMerge',
    handler: async (_root, { carIds, carFields }, { models }) => {
      return mergeCars(models, carIds, carFields);
    }
  },

  /**
   * Creates a new car category
   * @param {Object} doc Car category document
   */
  {
    name: 'carCategoriesAdd',
    handler: async (_root, doc, { user, docModifier, models }) => {
      const carCategory = await createCarCategory(models, docModifier(doc));

      // await putCreateLog(
      //   {
      //     type: MODULE_NAMES.CAR_CATEGORY,
      //     newData: { ...doc, order: carCategory.order },
      //     object: carCategory,
      //   },
      //   user,
      // );

      return carCategory;
    }
  },

  /**
   * Edits a car category
   * @param {string} param2._id CarCategory id
   * @param {Object} param2.doc CarCategory info
   */
  {
    name: 'carCategoriesEdit',
    handler: async (_root, { _id, ...doc }, { user, models }) => {
      // const carCategory = await getCarCatogery(models, { _id });
      const updated = await updateCarCategory(models, _id, doc);

      // await putUpdateLog(
      //   {
      //     type: MODULE_NAMES.CAR_CATEGORY,
      //     object: carCategory,
      //     newData: doc,
      //     updatedDocument: updated,
      //   },
      //   user,
      // );

      return updated;
    }
  },

  /**
   * Removes a car category
   * @param {string} param1._id CarCategory id
   */
  {
    name: 'carCategoriesRemove',
    handler: async (_root, { _id }: { _id: string }, { user, models }) => {
      const carCategory = await getCarCatogery(models, { _id });
      const removed = await createCarCategory(models, _id);

      // await putDeleteLog({ type: MODULE_NAMES.CAR_CATEGORY, object: carCategory }, user);

      return removed;
    }
  }

]

export default carMutations;
