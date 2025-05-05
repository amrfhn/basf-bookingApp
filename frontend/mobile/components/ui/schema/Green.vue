<template>
  <div class="green">
    <slot />
  </div>
</template>

<style lang="scss">
@import "~/assets/styles/basf-semantic-ui/schemas.scss";
@import "~/assets/styles/basf-semantic-ui/responsive.scss";

.green {
  $base: $basf_dark_green;
  $focus: $basf_dark_green_2;

  $base-contrast: $basf_light_green;
  $focus-contrast: $basf_light_green_2;

  .brand-header {
    background-color: $base !important;
  }

  .basf-box2 {
    background-color: $base;
  }

  .basf-box3 {
    h1, h2, h3, h4, h5, h6 {
      color: $base;
    }
  }

  .button.primary {
    background-color: $base;

    &:hover {
      background-color: $focus;
    }
  }

  .button.secondary {
    background-color: $base-contrast;

    &:hover {
      background-color: $focus-contrast;
    }
  }

  .datepicker {
    .cell.day.weekend {
      background-color: $box_grey;
    }

    .cell.day.selected {
      background-color: $pale_dark_green;
    }

    .cell:not(.blank):not(.disabled).day:hover,
    .cell:not(.blank):not(.disabled).month:hover,
    .cell:not(.blank):not(.disabled).year:hover {
      border-color: $basf_dark_green_4;
    }

    .vdp-datepicker .dp input:focus-visible {
      outline-color: $basf_dark_green_4;
    }

  }

  .radio {
    label:before {
      border-color: $base;
    }

    label:after {
      background-color: $base;
    }
  }

  .accordion-wrapper {
    .accordion-icon {
      color: $base;
    }
    .accordion-title {
      color: $base;
    }
  }

  .progressBar2,
  .progressBar{
    span{
      background-color: $base;
    }
  }

  input,
  .ldapSearch input,
  .datepicker .vdp-datepicker .dp input,
  .fileUpload > #placeholder,
  .dropdown{
    &:focus-visible {
      outline: $base solid 0.5px;
      outline-offset: -1px;
    }
  }

  .modal .background .dialog .content .header{
    h1, h2, h3, h4, h5, h6 {
      color: $base;
    }
  }
}
</style>
