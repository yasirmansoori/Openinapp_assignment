<!-- Intro  -->
<h3 align="center">
        <samp>&gt;Welcome to Openinapp Assignment! 🛍️</samp>
</h3>
<br />

## 👩‍💻Tech Stack & Tools
![Javascript](https://img.shields.io/badge/Javascript-F0DB4F?style=for-the-badge&labelColor=black&logo=javascript&logoColor=F0DB4F)
![Nodejs](https://img.shields.io/badge/Nodejs-3C873A?style=for-the-badge&labelColor=black&logo=node.js&logoColor=3C873A)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Markdown](https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white)
![VSCode](https://img.shields.io/badge/Visual_Studio-0078d7?style=for-the-badge&logo=visual%20studio&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-black?style=for-the-badge&logo=github&logoColor=white)
<br/>

## 📦 Getting Started

`To get started with the Openinapp Assignment, follow these steps:`

### ✅Prerequisites
- Node.js and npm installed
- MongoDB installed and running

### 💻 Installation

- Clone the repository: 
```sh
git gh repo clone yasirmansoori/Openinapp_assignment
````
- Install dependencies: 
```sh
npm install
````
- Start the development server:
```sh
  npm run dev
```
- Set up `.env` file.
```sh
CONNECTION_URI = <your-mongodb-connection-string>
DATABASE_NAME = <database-name-you-want>
SECRET_KEY = <your-mongodb-connection-string>
ACCESS_TOKEN_SECRET = <generated-access-token-secret>
```
**NOTE** : You can generate your own access and refresh token secrets by running the following command in your terminal 2 times:
```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
```
or you can use the secretGenerator.js file in the directory `src/config` to generate your secrets.

## **📚Schema Overview**
-   ### User

    -   `_id` _(auto-generated-unique)_ 
    -   `name`
    -   `phone_number` _(unique)_
    -   `priority` _(default: 0)_ //for twilio calling 
    -   `tasks` _(array of task ids)_
    -   `subtasks` _(array of subtask ids)_
    -   `role` _(default: user)_

-   ### Task

    -   `_id` _(auto-generated-unique)_ 
    -   `title`
    -   `description`
    -   `due_date`
    -   `status` _(default: TODO)_
    -   `priority` _(default: 0)_
    -   `assigned_to` _(userId, default :null)_
    -   `subtasks` _(array of subtask ids)_

-   ### Sub Task

    -   `_id` _(auto-generated-unique)_ 
    -   `task_id` _(taskId Reference)_
    -   `title`
    -   `description`
    -   `due_date`
    -   `status` _(default: 0 (pennding))_

## **🚀API Router Endpoints** 

<h1>User Routes -</h1>
<table>
  <tr>
    <th colspan="3" style="text-align:center">User</th>
  </tr>
  <tr>
    <td>Endpoints</td>
    <td>Method</td>
    <td>Description</td>
  </tr>
  <tr>
    <td>/api/user/register</td>
    <td>POST</td>
    <td>Welcome aboard! Register as a new user.</td>
  </tr>
</table>

<h1>Task Routes -</h1>
<table>
  <tr>
    <th colspan="3"style="text-align:center">Task</th>
  </tr>
  <tr>
    <td>Endpoints</td>
    <td>Method</td>
    <td>Description</td>
  </tr>
  <tr>
    <td>/api/task/createTask</td>
    <td>POST</td>
    <td>Create a task (admin)</td>
  </tr>
  <tr>
    <td>/api/task/assignTask/:taskId</td>
    <td>POST</td>
    <td>Assign a task to a user (admin)</td>
  </tr>
  <tr>
    <td>/api/task/getAllTasks</td>
    <td>GET</td>
    <td>Get all user tasks provided user id.</td>
  </tr>
  <tr>
    <td>/api/task/updateTask/:taskId</td>
    <td>PATCH</td>
    <td>Update a task.</td>
  </tr>
  <tr>
    <td>/api/task/deleteTask/:taskId</td>
    <td>DELETE</td>
    <td>Delete a task.</td>
  </tr>
</table>

<h1>Sub Task Routes -</h1>
<table>
  <tr>
    <th colspan="3"style="text-align:center">Sub Task</th>
  </tr>
  <tr>
    <td>Endpoints</td>
    <td>Method</td>
    <td>Description</td>
  </tr>
  <tr>
    <td>/api/subTask/createSubTask</td>
    <td>POST</td>
    <td>Create a sub-task (admin)</td>
  </tr>
  <tr>
    <td>/api/subTask/getAllSubTasks</td>
    <td>GET</td>
    <td>Get all user sub tasks.</td>
  </tr>
  <tr>
    <td>/api/subTask/updateSubTask/:subTaskId</td>
    <td>PATCH</td>
    <td>Update a sub task.</td>
  </tr>
  <tr>
    <td>/api/subTask/deleteSubTask/:subTaskId</td>
    <td>DELETE</td>
    <td>Delete a sub task.</td>
  </tr>
</table>

## **API Response Codes**
|                    | `200` | `201`   | `400`       | `401`        | `403`     | `404`     | `500`                 | `503`               |
| ------------------ | ----- | ------- | ----------- | ------------ | --------- | --------- | --------------------- | ------------------- |
| API Response Codes | OK    | Created | Bad Request | Unauthorized | Forbidden | Not Found | Internal Server Error | Service Unavailable |

## **API Response Structure**
|                    | `status`           | `message`                | `data`        | `error`                |
| ------------------ | ------------------ | ------------------------ | ------------- | ---------------------- |
| API Response Codes | HTTP Response Code | Response message Created | Response data | Error message (if any) |

## 📝 License
The E-Commerce API is open-source software licensed under the [MIT License](LICENSE).