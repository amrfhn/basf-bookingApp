<template>
  <box3>
    <h1> {{ $t('about.title') }} </h1>
    <p> {{ $t('about.text') }} </p>
    <p>
      {{ $t("about.contact") }}
      <a href="mailto:dbt-fow-support-team@basf.com">{{
        $t("about.supportEmail")
      }}</a>
    </p>
    <p>
      {{ $t('about.link') }}
      <a @click="$router.push(localePath('/book') + '/')">Future of Work</a>
    </p>
    <p>
      {{ $t('about.introFow') }}<a
        href="https://basf.sharepoint.com/teams/DigitalBuildingTwin/SitePages/FoW---FutureOfWork-desk-booking-app.aspx"
        title="Future Of Work desk booking app"
        target="_blank"
      >
        {{ $t('about.knowledgeBase') }}
      </a>
    </p>
  </box3>
</template>

<script>
export default {
  name: 'AboutUs'
}
</script>

<style scoped>
p{
  font-weight: 500;
  line-height: 40px;
  font-size: 16px;
}
a{
  cursor: pointer;
}
</style>
