import _ from 'lodash';

export const setPropCats = (propCats, dashboard, dispatch)=>{
  const catDictionary = {};
  if (propCats&&propCats.length>0) {
    propCats.map((propCat)=>{
      const cats = _.concat([propCat.main], propCat.subs);
      cats.map((cat)=>{
        const catId = cat._id;
        catDictionary[catId] = cat;
      });
    });

    dispatch({
      type: 'AddDashboard',
      payload: {
        propCats,
        propCatDictionary: catDictionary,
      },
    });
  }
};
