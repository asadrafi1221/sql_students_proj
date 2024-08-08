import {
    craete_user,
    getstudents_data,
    userexist,
    update_data,
    deletestudent,
    resultinclass,
    getclass_students,
    getalldata,
    findbyrollnum,
    getbymarks

}
    from "../controllers/datahandling.js";


import express, { Router } from "express";

const route = Router();

route
    .post('/create', craete_user)
    .get('/findbyrollnum',findbyrollnum)
    .get('/find', resultinclass)
    .get('/getclass', getclass_students)
    .post('/userexist', userexist)
    .get('/getall', getalldata)
    .patch('/updatestudent', update_data)
    .delete('/delete', deletestudent)
    .get('/getbymarks',getbymarks)
export default route;