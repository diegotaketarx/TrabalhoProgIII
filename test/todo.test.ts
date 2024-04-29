import app from '../src/app'
import { describe, it, afterAll } from '@jest/globals'
import mongoose from 'mongoose'
import todoUserModel from '../src/todolist/schemas/todolistUser.schemas'
import * as request from 'supertest'
import todoTaskModel from '../src/todolist/schemas/todolistTask.schemas'

describe('/todolist endpoint', () => {
    afterAll(async () => {
        await mongoose.connection.close()
    })

    it.skip('Um Usuario deverá ser inserido', async () => {
        const UserMock = {
            id: 123,
            name:'Paulo',
            weight:100,
            password:'12345',
            email:'paulo@hotmail.com'
        }

        const response = await request.default(app).post('/todolist').send(UserMock)
        const findedUser = await todoUserModel.findById(response.body._id)

        expect(response.status).toEqual(201)
        expect(response.body._id).toBeDefined()
        expect(UserMock.id).toBe(findedUser?.id)
        expect(UserMock.name).toBe(findedUser?.name)
        expect(UserMock.weight).toBe(findedUser?.weight)
        expect(UserMock.password).toBe(findedUser?.password)
        expect(UserMock.email).toBe(findedUser?.email)
    })

    it.skip('buscar todos os usuarios no banco', async () => {
        const response = await request.default(app).get('/todolist')
        const totalUserOnDatabase = await todoUserModel.countDocuments()

        expect(response.body.length).toEqual(totalUserOnDatabase)
    })

    it.skip('Deletar um usuario no banco', async () => {
        const userIdToDelete = '662d73e11539f6947fb81bd7' // Substitua pelo ID real do usuário
    
        const response = await request.default(app).delete(`/todolist/${userIdToDelete}`);
    
        expect(response.status).toEqual(200);
    
        const deletedUser = await todoUserModel.findById(userIdToDelete);
        expect(deletedUser).toBeNull();
    }, 10000);




    it('atualizar os usuarios no banco', async () => {
        const TaskIdToUpdate = '662d87696e2fa0e00bd94eef';
        const updatedTaskData = {
        title:"teste",
        description:"teste2",
        todoType:"tipo",
        category:"categoria",
        todoStatus:"andamento",
        associatedUser:"eu1"
        };

        const response = await request.default(app)
            .put(`/todolist/${TaskIdToUpdate}`)
            .send(updatedTaskData);

        expect(response.status).toEqual(200);

        const updatedUser = await todoTaskModel.findById(TaskIdToUpdate);
        expect(updatedUser?.title).toEqual(updatedTaskData.title);
        expect(updatedUser?.description).toEqual(updatedTaskData.description);
        expect(updatedUser?.todoType).toEqual(updatedTaskData.todoType);
        expect(updatedUser?.category).toEqual(updatedTaskData.category);
        expect(updatedUser?.todoStatus).toEqual(updatedTaskData.todoStatus);
        expect(updatedUser?.associatedUser).toEqual(updatedTaskData.associatedUser);
        
    });

})