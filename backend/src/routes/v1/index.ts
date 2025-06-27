import express from 'express';
import publicRoutes from './publicRoutes';
import adminRoutes from './adminRoutes';

const v1Router = express.Router();

v1Router.use('/public', publicRoutes);
v1Router.use('/admin', adminRoutes);

export default v1Router;
