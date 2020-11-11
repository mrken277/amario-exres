import { getCar } from "../utils";
import * as badWords from 'bad-words';

const generateFilter = async (models, params, commonQuerySelector) => {
  const filter: any = commonQuerySelector;

  if (params.categoryId) {
    filter.categoryId = params.categoryId;
  }

  if (params.searchValue) {
    filter.searchText = { $in: [new RegExp(`.*${params.searchValue}.*`, 'i')] }
  }

  if (params.ids) {
    filter._id = { $in: params.ids };
  }

  if (params.tag) {
    filter.tagIds = { $in: [params.tag] };
  }

  if (params.brand) {
    filter.brandIds = { $in: [params.brand] };
  }

  if (params.conformityMainTypeId && params.conformityMainType && params.conformityIsSaved) {
    filter._id = { $in: await models.Conformities.savedConformity({ mainType: params.conformityMainType, mainTypeId: params.conformityMainTypeId, relTypes: ['car'] }) }
  }
  if (params.conformityMainTypeId && params.conformityMainType && params.conformityIsRelated) {
    filter._id = { $in: await models.Conformities.relatedConformity({ mainType: params.conformityMainType, mainTypeId: params.conformityMainTypeId, relType: 'car' }) }
  }

  return filter;
}

const carQueries = [
  /**
   * Cars list
   */
  {
    name: 'cars',
    handler: async (_root, params, { commonQuerySelector, models }) => {
      // return paginate(models.Cars.find(await generateFilter(models, params, commonQuerySelector)), {
      //   page: params.page,
      //   perPage: params.perPage
      // });
      console.log('mmmmmmmm', badWords)

      return models.Cars.find(await generateFilter(models, params, commonQuerySelector));
    }
  },

  /**
   * Cars for only main list
   */
  {
    name: 'carsMain',
    handler: async (_root, params, { commonQuerySelector, models }) => {
      const filter = await generateFilter(models, params, commonQuerySelector);

      // return {
      //   list: paginate(models.Cars.find(filter), {
      //     page: params.page,
      //     perPage: params.perPage
      //   }),
      //   totalCount: models.Cars.find(filter).count()
      // };
      return {
        list: models.Cars.find(filter),
        totalCount: models.Cars.find(filter).count()
      };
    }
  },

  /**
   * Get one car
   */
  {
    name: 'carDetail',
    handler: (_root, { _id }, { models }) => {
      return getCar(models, _id);
    }
  },

  {
    name: 'carCategories',
    handler: async (
      _root,
      { parentId, searchValue },
      { commonQuerySelector, models },
    ) => {
      const filter: any = commonQuerySelector;

      if (parentId) {
        filter.parentId = parentId;
      }

      if (searchValue) {
        filter.name = new RegExp(`.*${searchValue}.*`, 'i');
      }

      return models.CarCategories.find(filter).sort({ order: 1 });
    }
  },

  {
    name: 'carCategoriesTotalCount',
    handler: (_root, _param, { models }) => {
      return models.CarCategories.find().countDocuments();
    }
  },

  {
    name: 'carCategoryDetail',
    handler: (_root, { _id }, { models }) => {
      return models.CarCategories.findOne({ _id });
    }
  },

]

export default carQueries;