<script setup>
import { computed, ref, onMounted } from "vue";
import { use_store } from "@/stores/store";
const store = use_store();
const user = computed(() => store.user);

import {default as general_location_photo} from '@/assets/general_location_photo.png'

const loading = ref(false)

const set_sex = async (sex) => {
  loading.value = true
  await store.set_sex(sex);
  
};

const detailed = ref(false)
const show_detailed_photo = async () => {
  detailed.value = !detailed.value
  
};

</script>

<template>

  <div v-if="!user.id && loading">
    <button class="button is-primary is-loading">Loading</button>
  </div>

  <div data-test-id="result" v-if="user.id">
    Your team: <div data-test-id="team_id">{{ user.team_id }}</div><br />
    Your location: <div data-test-id="location_id">{{ user.location_id }}</div><br />
    Your station: <div data-test-id="station_id">{{ user.station_id }}</div><br />
    Location map:
    <div data-test-id="image">
      <img
        @click="show_detailed_photo()"
        :src="detailed ? user.location_photo : general_location_photo"
        alt=""
        border="1"
        height="800"
        width="800"
        data-test-id="location_photo"
      />
    </div>
  </div>

  <div data-test-id="first_view" v-if="!user.id && !loading">
    <div ><button data-test-id="button_man" class="button is-info" @click="set_sex('male')">I am a man.</button><br /></div>
    <br />

    <div ><button data-test-id="button_woman" class="button is-primary" @click="set_sex('female')">I am a woman.</button><br /></div>
    <br />
  </div>
</template>

