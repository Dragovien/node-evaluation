import dayjs from 'dayjs';

export const formattedArray = (array) => {
  let formattedStudentsArray = [...array];
  formattedStudentsArray = formattedStudentsArray.map(student => {
    console.log('notFormatted', student.birth);
    const formattedDate = dayjs(student.birth, 'YYYY-DD-MM').format('DD/MM/YYYY');
    console.log('formatted',formattedDate )
    return { ...student, birth: formattedDate };
  });

  return formattedStudentsArray; 
}