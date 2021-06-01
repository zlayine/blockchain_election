<template>
  <div class="main flex flex-col relative min-h-screen">
    <navbar />

  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
export default {
	data(){
		return {
			
		}
	},
	methods: {

	},
  components: { Navbar },
};
</script>

<style>
html {
  width: 100%;
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
* {
  font-family: "Open Sans", sans-serif;
  letter-spacing: 0px;
}
.fade-enter-active,
fade-leave-active {
  transition: all 0.4s ease-in-out;
  opacity: 1;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.expand-sm-enter-active,
.expand-sm-leave-active {
  transition: all 0.2s ease-in-out;
  max-height: 230px;
}
.expand-sm-enter-from,
.expand-sm-leave-to {
  opacity: 0;
  max-height: 0px;
}
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease-in-out;
  max-height: 700px;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.fade-out-enter-active {
  transition: opacity 0.2s ease-in-out;
}
.fade-out-leave-active {
  display: none;
}
.fade-out-enter-from,
.fade-out-leave-to {
  opacity: 0;
}
.slide-top-enter-active,
.slide-top-leave-active {
  transition: all 0.2s ease-in-out;
  top: 0;
}
.slide-top-enter-from,
.slide-top-leave-to {
  top: -100px;
}
.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: all 0.4s ease-in-out;
  transform: translateY(0%);
}
.slide-bottom-enter-from,
.slide-bottom-leave-to {
  transform: translateY(100%);
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s ease-in-out;
  transform: translateY(0%);
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
}
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s ease-in-out;
  transform: translateX(0%);
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(200%);
}
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.2s ease-in-out;
  transform: translateX(0%);
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}
</style>
