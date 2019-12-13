import $ from 'jquery'

/** 下划线转换驼峰 */
export function toHump(name: string) {
  return name.replace(/_(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
}

/** 驼峰转换下划线 */
export function toLine(name: string) {
  return name.replace(/([A-Z])/g, "_$1").toLowerCase();
}



/**
 * 顶部工具条固定方法
 */
export function findToolBarElement() {
  const els = $('section.ant-layout')
  if (els.length === 3) {
    return els[2]
  }
  return undefined
}
export function handlerScroll(doFixed, unFixed, event) {
  const fixedTop = event.target.offsetTop
  const scrollTop = event.target.scrollTop
  //控制元素块A随鼠标滚动固定在顶部
  // console.log(scrollTop)
  // console.log(fixedTop)
  if (scrollTop >= fixedTop * 2 / 3) {
    doFixed()
  } else if (scrollTop < fixedTop * 2 / 3) {
    unFixed()
  }
}
export function addToolBarScrollEventListener(doFixed, unFixed) {
  const toolBarEle = findToolBarElement()
  toolBarEle &&
    toolBarEle.addEventListener(
      'scroll',
      handlerScroll.bind(toolBarEle, doFixed, unFixed)
    )
}
export function removeToolBarScrollEventListener() {
  const toolBarEle = findToolBarElement()
  toolBarEle &&
    toolBarEle.removeEventListener('scroll', () => {

    })
}
