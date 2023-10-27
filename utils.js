import dayjs from 'dayjs';

export const formattedArray = (array) => {
  let formattedStudentsArray = [...array];

  formattedStudentsArray = formattedStudentsArray.map(student => {
    let rearrangedDate = student.birth.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1-$3-$2')
    const formattedDate = dayjs(rearrangedDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
    return { ...student, birth: formattedDate };
  });

  return formattedStudentsArray; 
}

export const verifyInput = (res,name, birth, students) => {
  if (
    name?.trim() === ''
    || birth?.trim() === ''
    || name?.trim() === '' && birth?.trim()
  ) {
    let message = ''
    if (name?.trim() === '' && birth?.trim() === '') {
      message = 'les 2 champs'
    } else {
      message = name?.trim() === '' ? 'un nom' : 'une date de naissance'
    }

    console.log(`Veuillez rentrer ${message}`)
    res.writeHead(302, { 'Location': '/' });
    res.end()
  }

  if (!isNaN(parseInt(name.trim()))) {
    console.log(`Veuillez rentrer une chaine de caractères`)
    res.writeHead(302, { 'Location': '/' });
    res.end()
  }

  birth = dayjs(birth, 'YYYY-MM-DD').format('YYYY-DD-MM')

  if(students.filter(student => student.name === name && student.birth === birth).length > 0) {
    console.log(`L'élève existe déjà`)
    res.writeHead(302, { 'Location': '/' });
    res.end()
  } else {
    students.push({ name, birth })
    res.writeHead(302, { 'Location': '/' });
    res.end();
  }
}

export const deleteStudent = (res, array, index) => {
  array.splice(index,1)
  console.log(array)
  res.writeHead(302, { 'Location': '/users' });
  res.end();
}