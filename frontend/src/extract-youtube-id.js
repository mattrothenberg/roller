export default function extractYoutubeId(url) {
  if(url.indexOf("youtu.be") !== -1) {
    return url.substr(url.indexOf(".be/") + 4);
  } else {
    var params = url.substr(url.indexOf('?') + 1).split('&');
    return params
      .filter(function(queryParam) { return queryParam.substr(0,2) === 'v='; })[0]
      .split('=')[1];
  }
}