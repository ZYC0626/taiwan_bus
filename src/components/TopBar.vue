<template>
  <!-- As a link -->
  <nav class="navbar navbar-light navbar-padding bg-white">
    <div class="container-fluid px-0">
      <a class="navbar-brand" href="#">
        <img src="@/assets/images/LOGO.png" alt="LOGO" height="40">
      </a>
      <ul class="cus_nav-link m-auto d-md-flex d-none">
        <li class="cus_nav-link-item" :class="{ active: $route.name === 'nearStation'}"><router-link to="/NearbyStation">附近站牌</router-link></li>
        <li class="cus_nav-link-item" :class="{ active: $route.name === 'stopSearch'}"><router-link to="/StopSearch">站點查詢</router-link></li>
        <li class="cus_nav-link-item" :class="{ active: $route.name === 'likeBus'}"><router-link to="/LikeBus">收藏站牌</router-link></li>
      </ul>
      <div class="d-block d-md-none">
        <a data-bs-toggle="offcanvas" href="#offcanvasExample"><img src="@/assets/images/sideMenu.svg" height="24" alt="menu"></a>
      </div>
    </div>
  </nav>
  <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasExample">
  <div class="offcanvas-header">
    <a href="#">
    <img src="@/assets/images/LOGO.png" alt="LOGO" height="42">
    </a>
    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body p-0">
    <ul class="d-flex flex-column p-0">
        <li class="canvas-link" :class="{ active: $route.name === 'nearStation'}"><router-link to="/NearbyStation">附近站牌</router-link></li>
        <li class="canvas-link" :class="{ active: $route.name === 'stopSearch'}">站點查詢</li>
        <li class="canvas-link" :class="{ active: $route.name === 'likeBus'}"><router-link to="/LikeBus">收藏站牌</router-link></li>
    </ul>
  </div>
</div>
</template>
