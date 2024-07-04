import _ from 'lodash';

export const setPaymentS = (schedules, scheduleReducer, dispatch)=>{
  const {paymentScheduleDictionary} = scheduleReducer;
  const newPaymentScheduleDictionary = {};
  const scheduleIds = [];
  schedules.map((schedule)=>{
    const scheduleId = schedule._id;
    scheduleIds.push(scheduleId);
    newPaymentScheduleDictionary[scheduleId] = schedule;
  });


  const scheduleIdSet = new Set(scheduleIds);

  dispatch({
    type: 'AddSchedule',
    payload: {
      paymentScheduleDictionary: {
        ...paymentScheduleDictionary,
        ...newPaymentScheduleDictionary,
      },
    },
  });
};

export const setPaymentM = (milestones, scheduleReducer, dispatch)=>{
  const {paymentMilestoneDictionary} = scheduleReducer;
  const newPaymentMilestoneDictionary = {};
  const milestoneIds = [];
  milestones.map((milestone)=>{
    const milestoneId = milestone._id;
    milestoneIds.push(milestoneId);
    newPaymentMilestoneDictionary[milestoneId] = milestone;
  });

  dispatch({
    type: 'AddSchedule',
    payload: {
      paymentMilestoneDictionary: {
        ...paymentMilestoneDictionary,
        ...newPaymentMilestoneDictionary,
      },
    },
  });
};

export const setPaymentSAndM = (schedule, milestones, scheduleReducer, dispatch)=>{
  const {
    paymentScheduleDictionary,
    paymentMilestoneDictionary,
  } = scheduleReducer;

  const newPaymentScheduleObject = {};
  const scheduleId = schedule._id;
  newPaymentScheduleObject[scheduleId] = schedule;

  const newPaymentMilestoneDictionary = {};
  const milestoneIds = [];
  milestones.map((milestone)=>{
    const milestoneId = milestone._id;
    milestoneIds.push(milestoneId);
    newPaymentMilestoneDictionary[milestoneId] = milestone;
  });

  dispatch({
    type: 'AddSchedule',
    payload: {
      paymentScheduleDictionary: {
        ...paymentScheduleDictionary,
        ...newPaymentScheduleObject,
      },
      paymentMilestoneDictionary: {
        ...paymentMilestoneDictionary,
        ...newPaymentMilestoneDictionary,
      },
    },
  });
};


