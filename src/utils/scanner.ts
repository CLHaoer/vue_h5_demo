// 处理URL结果
const processUrlResult = (url: string) => {
  showDialog({
    title: '扫描到网址',
    message: `是否打开链接?\n${url.substring(0, 60)}${url.length > 60 ? '...' : ''}`,
    confirmButtonText: '打开',
    cancelButtonText: '取消',
    showCancelButton: true
  }).then(() => {
    // 确认打开
    window.location.href = url
  }).catch(() => {
    // 用户取消
    showToast('已取消打开链接')
  })
}

// 处理电话号码
const processPhoneResult = (phone: string) => {
  showDialog({
    title: '扫描到电话号码',
    message: `是否拨打电话?\n${phone}`,
    confirmButtonText: '拨打',
    cancelButtonText: '取消',
    showCancelButton: true
  }).then(() => {
    // 确认拨打
    window.location.href = `tel:${phone}`
  }).catch(() => {
    // 用户取消
    showToast('已取消拨打电话')
  })
}

// 处理身份证号
const processIdCardResult = (idCard: string) => {
  showDialog({
    title: '扫描结果',
    message: `可能是身份证号码，已复制到剪贴板\n${idCard}`,
    confirmButtonText: '确定'
  }).then(() => {
    // 复制到剪贴板
    navigator.clipboard.writeText(idCard)
      .then(() => showToast('已复制到剪贴板'))
      .catch(() => showToast('复制失败，请手动复制'))
  })
}

// 处理文本结果
const processTextResult = (text: string) => {
  showDialog({
    title: '扫描结果',
    message: text.length > 100 ? text.substring(0, 100) + '...' : text,
    confirmButtonText: '复制',
    cancelButtonText: '关闭',
    showCancelButton: true
  }).then(() => {
    // 复制到剪贴板
    navigator.clipboard.writeText(text)
      .then(() => showToast('已复制到剪贴板'))
      .catch(() => showToast('复制失败，请手动复制'))
  })
}

const scanSuccess = (result:string)=>{
  // 分析扫码结果
  if (!result || result.trim() === '') {
    showToast('二维码内容为空')
    return
  }

  // 判断结果类型并处理
  if (result.startsWith('http://') || result.startsWith('https://')) {
    // 网址类型
    processUrlResult(result)
  } else if (result.startsWith('tel:')) {
    // 电话号码
    processPhoneResult(result.replace('tel:', ''))
  } else if (/^\d{15,18}$/.test(result)) {
    // 可能是身份证号
    processIdCardResult(result)
  } else {
    // 其他类型的文本
    processTextResult(result)
  }
}
export default scanSuccess