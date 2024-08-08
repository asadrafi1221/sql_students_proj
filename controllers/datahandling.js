import db_data from "../../SQL_databas/databaseplugin.js";


const craete_user = async (req, res) => {
    const { student_name, class_name, roll_num } = req.body;

    const data = await db_data.query('select *  from student');
    console.log('this is data   : ');
    console.log(data.rows);

    await db_data.query(`insert into student(roll_num,student_name,class_name) VALUES ($1, $2, $3)`,
        [roll_num, student_name, class_name])

    res.send('done user created');

}

const update_data = async (req, res) => {
    try {
        console.log('PATCH is called');

        const data = await db_data.query('SELECT * FROM student');
        console.log(data.rows);

        const { roll_num, prev_roll, name, classname } = req.body;
        console.log(roll_num, prev_roll, name, classname);

        const result = await db_data.query(
            'UPDATE student SET roll_num = $1, student_name = $2, class_name = $3 WHERE roll_num = $4',
            [roll_num, name, classname, prev_roll]
        );

        res.send('User updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred: ' + err.message);
    }
};


const getclass_students = async (req, res) => {
    const obj = req.query;
    const class_name = obj.class;


    try {
        const data = await db_data.query(`select * from student where class_name=${class_name}`);
        const student_data = data.rows;
        const studentsum = data.rowCount;
        console.log(studentsum);
        console.log('hello');
        const subject_marks = await db_data.query(`select sum(subject_marks) as total_marks from subjects where class_name = ${class_name}`);
        console.log(subject_marks.rows);
        const totalmarks = subject_marks.rows[0].total_marks;
        const allstudents = studentsum * 100;
        console.log(allstudents)
        const avg = totalmarks * 100 / allstudents + ' %';
        res.send({ student_data, totalmarks, avg });

    } catch (err) {
        res.send(err)
    }
}

const deletestudent = async (req, res) => {
    const { roll_num } = req.body;

    await db_data.query('DELETE from student where roll_num = $1', [roll_num]);
    res.send('user deleted succesfully');

}

const findbyrollnum = async (req, res) => {
    const { roll_num } = req.body;

    console.log(req.query)
    if (!roll_num) {
        res.send('plz provide roll_num');
    }
    else {
        const data = await db_data.query(`SELECT * from student where roll_num = ${roll_num}`);
        const subjectable = await db_data.query(`select * from subjects where roll_num = ${roll_num}`);
        const subjectdata = await db_data.query(`select sum(subject_marks) as total_marks from subjects where roll_num = ${roll_num}`);
        const student_data = data.rows;
        const subject_arr = subjectable.rows;
        const total_marks = subjectdata.rows[0].total_marks;

        res.send({ student_data, subject_arr, total_marks });
    }
}


const resultinclass = async (req, res) => {
    const { name, class: className } = req.query;



    console.log(`Class Name: ${className}, Name: ${name}`);

    if (!name || isNaN(className)) {
        return res.status(400).send('please provide valid name and class');
    }

    try {
        const query = 'SELECT * FROM student WHERE student_name = $1 AND class_name = $2';
        const values = [name, className];


        const result = await db_data.query(query, values);
        const student_data = result.rows;
        const rollnum = student_data[0].roll_num;

        const alldata = (await db_data.query('SELECT * FROM subjects where roll_num = $1', [rollnum])).rows;
        console.log(alldata)
        const marks = await db_data.query(`select sum(subject_marks) as total_marks from subjects where roll_num = ${rollnum}`);
        const total_marks = marks.rows[0].total_marks;
        res.send({ student_data, alldata, total_marks });

    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('No student finded for your given data');
    }
}


const getbymarks = async (req, res) => {
    
    try {
        const { marks } = req.query;
        const data = await db_data.query('select roll_num from subjects');
        const data_arr = data.rows;
          
        
          
        const subjects = data.rowCount;
        console.log(`this is the marks ${marks} and ${subjects}`);

        const numbers = data_arr.map(item => item.roll_num);
        const uniqueNumbers = [...new Set(numbers)];
console.log(uniqueNumbers);

for (let i = 0; i < uniqueNumbers.length; i++) {
    const rollNumber = uniqueNumbers[i];
    const query = 'SELECT SUM(subject_marks) AS total_marks FROM subjects WHERE roll_num = $1';
    const values = [rollNumber];
    
    const result = await db_data.query(query, values);
    
    const total_marks = result.rows[0].total_marks;
    
    console.log(total_marks);
    console.log(i);

    if(total_marks===marks){
const data = (await db_data.query(`select * from subjects where roll_num = ${uniqueNumbers[i]}`)).rows;
        return res.send({data,total_marks});
        break;
    }
}


       



        res.send(data_arr);


    } catch (err) {
        console.log('database error', err);
        res.send('database error');
    }


}


const getstudents_data = async (req, res) => {
    const data = await db_data.query('SELECT * FROM student');
    const data_arr = data.rows;
    res.send(data_arr);
}
const getalldata = async (req, res) => {
    const data = await db_data.query('select * from student join subjects on student.roll_num =  subjects.roll_num');
    res.send(data.rows);
}



const userexist = async (req, res) => {
    const { subject_name, subject_marks, roll_num, subject_teacher, class_name } = req.body;

    const data = await db_data.query('SELECT * from student');
    const data_arr = data.rows;


    let userexist = false;
    for (let i = 0; i < data_arr.length; i++) {
        if (roll_num === data_arr[i].roll_num) {
            userexist = true;
            break;
        }
    }
    if (userexist === false) {
        res.send('sorry no user founded');
    }
    try {
        await db_data.query(`INSERT INTO subjects(subject_name,subject_marks ,roll_num,subject_teacher) VALUES ($1, $2, $3 , $4)`,
            [subject_name, subject_marks, roll_num, subject_teacher, class_name]);

        res.send('user commited succesfully');
    }
    catch (err) {
        res.send('sorry but your database error occured');
    }



}



export {
    craete_user,
    getstudents_data,
    userexist,
    update_data,
    getalldata,
    deletestudent,
    resultinclass,
    getclass_students,
    findbyrollnum,
    getbymarks
};

