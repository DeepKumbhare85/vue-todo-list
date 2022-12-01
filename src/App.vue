<script setup>
import { ref, watch, computed, watchEffect } from 'vue';
const taskList = ref(['pineapple', 'banana', 'mango', 'grapes', 'almonds', 'apple', 'coconut']);
const task = ref('');
const oldTask = ref('');
const isUpdateItem = ref(false);
const inputRef = ref(null);
const searchText = ref('');
const sortOrder = ref('none');

const filterList = computed(() => {
  return sortList(taskList.value.filter(t => {
    t = t.toLowerCase();
    return t.indexOf(searchText.value.toLowerCase()) > -1;
  }), sortOrder);
});

const clearTask = () => {
  task.value = '';
  oldTask.value = '';
  isUpdateItem.value = false;
}

const addTask = () => {
  if (task.value) {
    taskList.value.push(task.value);
    searchText.value = '';
    task.value = '';
  }
  else {
    alert("task cant be empty");
  }
}

const deleteTask = (taskToDelete) => {
  if (oldTask.value === taskToDelete) 
    clearTask();
  taskList.value = taskList.value.filter(t => t !== taskToDelete)
}

const updateTask = (updateTask) => {
  isUpdateItem.value = true;
  task.value = updateTask;
  oldTask.value = updateTask;
  inputRef.value.focus();
}

const handleUpdate = () => {
  let index = taskList.value.indexOf(oldTask.value);
  if (index > -1) {
    taskList.value[index] = task.value;
    searchText.value = '';
    clearTask();
  }
  else {
    alert("Task already deleted");
    clearTask();
  }
}


const sortList = (tempList, sortOrder) => {
  switch (sortOrder.value) {
    case 'asc':
      return tempList.sort();
    case 'desc':
      return tempList.sort().reverse();
    case 'none':
      return tempList;
  }
}


</script>

<template>
  <div>
    <h1>To-Do List</h1>
    <input type="text" id="searchbar" v-model="searchText" placeholder="Search Tasks ...." />
    <div>
      Sort Task :
      <button @click="sortOrder = 'asc'">Asc</button>
      <button @click="sortOrder = 'desc'">Desc</button>
      <button @click="sortOrder = 'none'">None</button>
    </div>
    <h2>Your Tasks</h2>
    <form @submit.prevent>
      <input v-model="task" type="text" ref="inputRef" />
      <button
        @click="isUpdateItem ? handleUpdate() : addTask()">{{ isUpdateItem ? 'Update Task' : 'Add Task' }}</button>
      <button v-show="isUpdateItem" @click="clearTask">Cancel</button>
    </form>
    <div class="item-list">
      <div v-for="(task, index) in filterList" :key="index">
        <div class="item">
          <h3 id="item-name">{{ task }}</h3>
          <button @click="updateTask(task)">Update</button>
          <button @click="deleteTask(task)">Delete</button>
        </div>
      </div>
      <div>Total Tasks: {{ filterList.length }}</div>
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

button {
  margin: .5rem;
}

#item-name {
  margin-right: auto;
}
#searchbar{
  width: 65vw;
  margin-bottom: .8rem;
  font-size: x-large;
  line-height: 2.5rem;
  border:1px solid black;
  border-radius: 12px;
  padding:5px;
}
</style>
