import express from 'express';
import studentRoutes from './publicRoutes';

const v1Router = express.Router();

v1Router.use('/public', studentRoutes);

export default v1Router;
