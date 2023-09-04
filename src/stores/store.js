import { ref, computed, reactive, watch } from 'vue'
import { defineStore } from 'pinia'
import api from '@/plugins/api'
import { time_out, image_to_Base64 } from "@/plugins/utilities";

export const use_store = defineStore('store', () => {
  //state----------------------------------------------------------------------------
  const count = ref(0)
  const field1_state = ref(null)
  const field2_state = ref('')
  const api_response_state = ref('')
  const affected_rows_state = ref(0)
  const returning_values_state = ref(0)
  const table1_state = ref('')
  const request_time_out = 3000;

  const user_state = ref({
    id: undefined,
    sex: undefined,
    team_id: undefined,
    location_id: undefined,
    station_id: undefined,
    direction: undefined,
    image_path: undefined,
    location_photo: undefined,
    general_location_photo: undefined,
  })

  const stat_state = ref({
    users_count: 25,
    male_share: 0.62,
    assigned_teams: 25,
    min_users_in_teams: 1,
    diff: 0,

  })

  const teams_stat_state = ref([
    {
      team_id: 444,
      cnt: 555
    },
  ])

  //Persistence------------------------------------------------------
  if (localStorage.getItem('user_state')) {
    user_state.value = JSON.parse(localStorage.getItem('user_state'))
  }

  watch(
    () => user_state.value,
    (val) => {
      localStorage.setItem('user_state', JSON.stringify(val))
    },
    { deep: true }
  )

  //getters/functions
  //make state reactive------------------------------------------------------
  const field1 = computed(() => field1_state.value)
  const field2 = computed(() => field2_state.value)
  const api_response = computed(() => api_response_state.value)
  const affected_rows = computed(() => affected_rows_state.value)
  const returning_values = computed(() => returning_values_state.value)

  const doubleCount = computed(() => count.value * 2)
  const table1 = computed(() => table1_state.value)

  const user = computed(() => user_state.value)
  const stat = computed(() => stat_state.value)
  const teams_stat = computed(() => teams_stat_state.value)

  //procedures (mutable actions)--------------------------------------------

  const set_sex = async (sex) => {
    user_state.value.sex = sex
    await get_user_info()
  }

  const get_user_info = async () => {
    await api
      .get(`/get_user_info?sex=${user.value.sex}`)
      .then(async (response) => {
        console.log('store, get_user_info, then', response.data)
        user_state.value.id = response.data.user_id
        user_state.value.team_id = response.data.team_id
        user_state.value.image_path = response.data.image_path
        user_state.value.location_id = response.data.location_id
        user_state.value.station_id = (response.data.location_id - 1) * 10 + response.data.station_id
        user_state.value.direction = response.data.direction

        await get_photo(response.data.user_id)
      })
      .catch(async (error) => {
        // console.error('game store, get_newpage, onRejected function called: ' + error)
        // console.error('game store, get_newpage, onRejected function called: ' + error.response)
        // console.log('game store, get_newpage, onRejected function called: ' + error.response)
        await time_out(request_time_out)
      })
  }

  const get_photo = async (user_id) => {
    await api
      .get(`/get_photo?user_id=${user_id}`
        , { responseType: 'arraybuffer' }
    )

      .then(async (response) => {
        console.log('store, get_photo, then', response.data)
        const blob = new Blob([response.data], { type: 'image/png' });
        user_state.value.location_photo = await image_to_Base64(blob)

      })
      .catch(async (error) => {
        // console.error('game store, get_newpage, onRejected function called: ' + error)
        // console.error('game store, get_newpage, onRejected function called: ' + error.response)
        // console.log('game store, get_newpage, onRejected function called: ' + error.response)
        await time_out(request_time_out)
        await get_photo(user_id)
      })
  }

  const get_stat = async () => {
    await api
      .get(`/get_stat`)
      .then(async (response) => {
        //console.log('store, get_stat, then', response.data)

        stat_state.value.users_count = response.data.users_count
        stat_state.value.male_share = response.data.male_share
        stat_state.value.assigned_teams = response.data.assigned_teams
        stat_state.value.min_users_in_teams = response.data.min_users_in_teams
        stat_state.value.diff = response.data.diff

        await get_teams_stat()
      })
      .catch(async (error) => {
        // console.error('game store, get_newpage, onRejected function called: ' + error)
        // console.error('game store, get_newpage, onRejected function called: ' + error.response)
        // console.log('game store, get_newpage, onRejected function called: ' + error.response)
        await time_out(request_time_out)
        await get_stat()
      })
  }

  const get_teams_stat = async () => {
    await api
      .get(`/get_teams_stat`)
      .then(async (response) => {
        console.log('store, get_teams_stat, then 100', response.data)

        teams_stat_state.value = response.data
        console.log('store, get_teams_stat, then 200', teams_stat.value)

      })
      .catch(async (error) => {
        console.error('game store, get_teams_stat, onRejected function called: ' + error)
        // console.error('game store, get_newpage, onRejected function called: ' + error.response)
        // console.log('game store, get_newpage, onRejected function called: ' + error.response)
        await time_out(request_time_out)
        await get_teams_stat()
      })
  }

  function increment() {
    count.value++
  }

  const delete_from_table1 = async () => {
    await api
      .post(`delete_table1`, {})
      .then((response) => {
        console.log(response.data)
        affected_rows_state.value = response.data
      })
      .catch((error) => {
        //game_state.value.error = error.response.data.message;
        console.error('game store, delete_from_table1, onRejected function called: ' + error)
        console.error(
          'game store, delete_from_table1, onRejected function called: ' + error.response
        )
        console.log('game store, delete_from_table1, onRejected function called: ' + error.response)
      })
  }

  const insert_into_table1 = async (field1, field2) => {
    await api
      .post(`add_table1`, {
        field1: field1,
        field2: field2
      })
      .then((response) => {
        console.log(response.data)
        returning_values_state.value = response.data
      })
      .catch((error) => {
        //game_state.value.error = error.response.data.message;
        console.error('game store, insert_into_table1, onRejected function called: ' + error)
        console.error(
          'game store, insert_into_table1, onRejected function called: ' + error.response
        )
        console.log('game store, insert_into_table1, onRejected function called: ' + error.response)
      })
  }

  const get_table1 = async () => {
    await api.get(`/table1`).then(async (response) => {
      console.log('store, get_table1, then', response.data, response.data.length)
      table1_state.value = ''
      //table1_state.push(response.data)
      table1_state.value = response.data
      console.log('store, get_table1, then', table1_state.value.length)
    })
  }

  //------------------------------------------------------------------------


  //helpers--------------------------------------------

  const get_max_id = (arr) => {
    const ids = arr.map((object) => {
      if (!isNaN(object.id)) return object.id
    })

    return Math.max(...ids)
  }

  //------------------------------------------------
  return {
    count,
    doubleCount,
    field1,
    field2,
    api_response,
    affected_rows,
    returning_values,
    table1,

    increment,
    //get_newpage,
    delete_from_table1,
    insert_into_table1,
    get_table1,

    user,
    set_sex,
    stat,
    teams_stat,
    get_stat,
  }
})
