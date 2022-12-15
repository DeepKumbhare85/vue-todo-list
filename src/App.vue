<script setup lang="ts">
import { useTheme } from 'vuetify'
import TaskList from './components/TaskList.vue';
import { ref, onBeforeMount,watch,computed } from 'vue';
import { Task as TaskInterface } from './types';
import axios  from 'axios';

const theme = useTheme()
const toggleTheme = () => theme.global.name.value = theme.global.current.value.dark ? 'lightTheme' : 'darkTheme'

const dataUrl = ref('http://localhost:3000/tasks');
const searchText = ref('');
const listLength = ref('0');
const order = ref('asc');
const sortBy = ref('id');
const currentPageNumber = ref(1);
const filterQuery=ref('isCompleted=true&isCompleted=false')
const baseUrl = computed(() => {
    return `${dataUrl}/?q=${searchText.value}&_sort=${sortBy.value}&_order=${order.value}&_page=${currentPageNumber.value}&_limit=5&${filterQuery.value}`
}
);
const taskList = ref<TaskInterface[]>([]);

const fetchData = async () => {
  console.log(baseUrl.value);
  await axios.get(baseUrl.value)
    .then(res => {
      taskList.value = res.data;
      console.log(res.data)
      listLength.value = res.headers["x-total-count"];
      console.log(listLength.value);
  } )
}

fetchData();

const addTask =async (task: TaskInterface) => {
  if (task.title) {
    let taskToAdd = {
      title: task.title,
      isCompleted: false
    }
    await axios.post(dataUrl.value, taskToAdd);
    fetchData();
  }
  task.title = '';
}

const deleteTask = async (deleteTaskId: TaskInterface['id']) => { 

  if (taskList.value.length === 1)
    currentPageNumber.value -= 1;
  console.log(`${dataUrl.value}/${deleteTaskId}`);
  await axios.delete(`${dataUrl.value}/${deleteTaskId}`)
 
  fetchData()
}

const handleUpdate = async (task: TaskInterface) => {

  await axios.put(`${dataUrl.value}/${task.id}`,
    {
      id:task.id,
      title: task.title,
      isCompleted:task.isCompleted
    },
    );
  fetchData();
  task.title = '';
  
}

const searchTask = async (searchValue) => {
  console.log('called');
  searchText.value = searchValue;
  console.log(searchText.value);
}

const toggleStatus = async (id:TaskInterface['id']) => {
  let toggleTask = await (await axios.get(`${dataUrl.value}/${id}`)).data
  await axios.put(`${dataUrl.value}/${id}`, {
    id: toggleTask.id,
    title: toggleTask.title,
    isCompleted: !toggleTask.isCompleted,
  })
  taskList.value.find(t => t.id === id).isCompleted = !toggleTask.isCompleted;
}

const sortList = (sortOrder) => {
  if (sortOrder === 'none') {
    order.value = 'asc';
    sortBy.value = 'id';
  }
  else { 
    sortBy.value = 'title';
    if (sortOrder === 'asc') 
      order.value = 'asc';
    else
      order.value = 'desc';
  }
}

const filterList = async (filterStatus) => {
  console.log(filterStatus);
  currentPageNumber.value=1
  if (filterStatus === 'all') {
    filterQuery.value = 'isCompleted=true&isCompleted=false';
  } else {
    filterQuery.value = filterStatus === 'complete' ? 'isCompleted=true' : 'isCompleted=false';
  }
}

const changePage = (newPageNo) => {
  currentPageNumber.value = newPageNo;
}

watch([baseUrl], () => {
  fetchData()
})

</script>

<template>
  <VApp>
    <VMain>
      <VBtn @click="toggleTheme">theme switch</VBtn>

      <VContainer>
        <TaskList :taskList="taskList" :listlength="listLength" @add-task="addTask" @delete-task="deleteTask" @update-task="handleUpdate" @toggle-status="toggleStatus"  @search-list="searchTask" @sort-list="sortList" @filter-list="filterList" @current-page-number="changePage"/>

      </VContainer>
    </VMain>
  </VApp>

</template>

<style lang="scss" scoped>

</style>
