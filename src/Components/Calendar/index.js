import React from 'react';
import { View } from 'react-native';
// @ts-expect-error
import { Calendar } from 'react-native-calendars';
import { getDates, numberToDoubleFigure } from '../../Utils';

export default ({ periods, activeDates, onDayPress, additionalDate, dotColor }) => {
  let markedDates = {};
  if (periods) {
    periods?.forEach((x, i) => {
      const dates = getDates(x.startingDay, x.endingDay);
      dates.forEach(function (d, index) {
        let dateCopy = new Date(d);
        let year = dateCopy.getFullYear();
        let month = numberToDoubleFigure(dateCopy.getMonth() + 1);
        let date = numberToDoubleFigure(dateCopy.getDate());
        let formualizedKey = markedDates[`${year}-${month}-${date}`];
        if (formualizedKey?.dots) {
          formualizedKey?.dots.push({
            color: dotColor,
            key: x.key,
          });
        } else {
          markedDates[`${year}-${month}-${date}`] = {
            dots: [
              {
                color: dotColor,
                key: x.key,
              },
            ],
          };
        }
      });
    });
  }
  if (activeDates) {
    activeDates.forEach(x => {
      let dateCopy = new Date(x.date);
      let year = dateCopy.getFullYear();
      let month = numberToDoubleFigure(dateCopy.getMonth() + 1);
      let date = numberToDoubleFigure(dateCopy.getDate());

      let formualizedKey = markedDates[`${year}-${month}-${date}`];

      if (formualizedKey?.dots) {
        formualizedKey?.dots.push({
          color: dotColor,
          key: x.key,
        });
      } else {
        markedDates[`${year}-${month}-${date}`] = {
          dots: [
            {
              color: dotColor,
              key: x.key,
            },
          ],
        };
      }
    });
  }

  return (
    <Calendar
      markedDates={{ ...additionalDate, ...markedDates }}
      markingType={'multi-dot'}
      onDayPress={onDayPress}
      // hideArrows={true}
      // renderHeader={() => null}
      theme={{}}
      hideExtraDays={true}
    />
  );
};
