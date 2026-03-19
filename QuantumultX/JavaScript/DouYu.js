// DouYu.js - 斗鱼去广告脚本
// GitHub - MengZiJun0262
let body = $response.body;
let url = $request.url;
let obj = JSON.parse(body);

// 根据不同的URL执行不同的过滤逻辑
if (obj && obj.data) {
  
  // 1. 首页推荐接口 (apiv2)
  if (url.includes('/mgapi/livenc/home/getRecV3')) {
    // 处理 rec_card 数组里的广告
    if (obj.data.rec_card && Array.isArray(obj.data.rec_card)) {
      obj.data.rec_card = obj.data.rec_card.map(card => {
        if (card.card_banner && Array.isArray(card.card_banner)) {
          // 过滤掉 type 为 54 的广告
          card.card_banner = card.card_banner.filter(item => item.type !== 54);
        }
        return card;
      });
    }
    
    // 处理 rec_cont 数组里的广告
    if (obj.data.rec_cont && Array.isArray(obj.data.rec_cont)) {
      // 过滤掉 type 为 2 的广告条目
      obj.data.rec_cont = obj.data.rec_cont.filter(item => item.type !== 2);
    }
  }
  
  // 2. 鱼吧/关注页接口 (apiv3 - followedUserFeedList)
  else if (url.includes('/mgapi/yubanc/api/feed/followedUserFeedList/v2')) {
    // 过滤掉 type 为 "ad" 的条目
    if (obj.data.list && Array.isArray(obj.data.list)) {
      obj.data.list = obj.data.list.filter(item => item.type !== "ad");
    }
  }
  
  // 3. 鱼吧/推荐页接口 (apiv3 - yubaTab/recommendFeedList)
  else if (url.includes('/mgapi/yubanc/api/yubaTab/recommendFeedList')) {
    // 删除顶层的 ad 对象
    if (obj.data.ad) {
      delete obj.data.ad;
    }
    // feed_list 和 topic_card 里的内容全部保留
  }
  
  // 其他
}

$done({body: JSON.stringify(obj)});
