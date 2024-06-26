window.onload = function() {
  configureSite();
}

function configureSite() {
  configureHeader();
}
function configureHeader() {
  const header = document.getElementsByTagName("header")[0].getElementsByClassName("header")[0];
  header.style.width = "fit-content";
  const headerWidth = header.getBoundingClientRect().width;
  //header.style.width = headerWidth + "px";
  configureTabs(headerWidth);
}
function configureTabs(headerWidth = 0) {
  const tabs = document.getElementsByTagName("tabs")[0];
  tabs.style.width = "fit-content";
  const tabsContentWidth = tabs.getBoundingClientRect().width;
  tabs.style.width = `calc(100% - ${headerWidth}px - 5rem)`;
  tabs.style.height = "6rem";
  tabs.style.paddingLeft = "3rem";
  tabs.style.alignItems = "center";
  configureMain("1rem");
  if (tabsContentWidth > tabs.getBoundingClientRect().width) {
    //not enough space
    //alert('not enough')
    tabs.style.height = "11rem";
    tabs.style.alignItems = "flex-end";
    tabs.style.width = "calc(100% - 9rem)";
    tabs.style.paddingLeft = "1rem";
    configureMain("6rem");
  }
}
function configureMain(marginTop) {
  const main = document.getElementsByTagName("main")[0];
  main.style.marginTop = marginTop;
}


window.onresize = configureSite;
