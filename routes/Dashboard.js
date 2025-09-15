import express from 'express'
import isAdmin from '../middlewares/isAdmin.js'
import { getAllData, getAllUsers, deleteUser } from '../controllers/Dashboard.js'

const DashboardRoutes = express.Router()

DashboardRoutes.get("/", isAdmin, getAllData)
DashboardRoutes.get("/users", isAdmin, getAllUsers)
DashboardRoutes.delete("/deleteuser/:id", isAdmin, deleteUser)

export default DashboardRoutes