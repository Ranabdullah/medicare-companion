'use strict';
if (!localStorage.getItem('medicare_demo_initialized')) {
  window.BUYER_EXAMPLE();
  localStorage.setItem('medicare_demo_initialized','1');
}
