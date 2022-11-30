<script setup>
import { ref } from 'vue';
const taskList = ref(['Task 1', 'Task 2'])
const task = ref('');
const taskUpdateId = ref(-1);
const isUpdateItem = ref(false);
const inputRef = ref(null);

const addTask = () => {
  if (task.value) {
    taskList.value.push(task.value);
    console.log(taskList.value);
    task.value = '';
  }
  else {
    alert("task cant be empty");
  }
}

const deleteTask = (tasktoDelete) => {
  taskList.value = taskList.value.filter(t => t !== tasktoDelete)
  console.log(taskList.value)
}

const updateTask = (updateTaskId) => {
  isUpdateItem.value = true;
  task.value = taskList.value[updateTaskId];
  taskUpdateId.value = updateTaskId;

  setInterval(() => {
    inputRef.value.focus();
  }, 1);
}

const handleUpdate = () => {

  if (taskList.value[taskUpdateId.value]) {
    taskList.value[taskUpdateId.value] = task.value;
    task.value = '';
    taskUpdateId.value = -1;
    isUpdateItem.value = false;
  }
  else {
    alert("Task already deleted");
    task.value = '';
    taskUpdateId.value = -1;
    isUpdateItem.value = false;
  }
}

const handleClose = () => {
  task.value = '';
  taskUpdateId.value = -1;
  isUpdateItem.value = false;
}

</script>

<template>
  <div>
    <h1>To-Do List</h1>
    <div class="update-item" v-show="isUpdateItem">
      <input type="text" v-model="task" ref="inputRef" />
      <button @click="handleUpdate">Update</button>
      <button @click="handleClose">Close</button>
    </div>
    <div v-show="!isUpdateItem" class="add-item">
      <input type="text" v-model="task" />
      <button @click="addTask">Add Task</button>
    </div>
    <div class="item-list">
      <h2>Your Tasks</h2>
      <div v-for="(task, id) in taskList" :key="id">
        <div class="item">
          <h3 id="item-name">{{ task }}</h3>
          <button @click="updateTask(id)">Update</button>
          <button @click="deleteTask(task)">Delete</button>
        </div>
      </div>
    </div>
  </div>

</template>
<style scoped>
.item-list {
  margin: 2rem 0;
  width: 75vw;
}

.item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
  border: 2px solid black;
  padding: .4rem 2rem;
  border-radius: 1.5rem;
}

.update-item button {
  margin: .5rem;
}

#item-name {
  margin-right: auto;
}
</style>
