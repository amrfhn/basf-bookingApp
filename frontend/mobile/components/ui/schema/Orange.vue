<template>
  <div class="orange">
    <slot />
  </div>
</template>

<style lang="scss">
@import "~/assets/styles/basf-semantic-ui/schemas.scss";
@import "~/assets/styles/basf-semantic-ui/responsive.scss";

.orange {
  $base: $basf_orange;
  $focus: $basf_orange_2;

  $base-contrast: $basf_red;
  $focus-contrast: $basf_red_2;

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
      background-color: $pale_orange;
    }

    .cell:not(.blank):not(.disabled).day:hover,
    .cell:not(.blank):not(.disabled).month:hover,
    .cell:not(.blank):not(.disabled).year:hover {
      border-color: $basf_orange_4;
    }

    .vdp-datepicker .dp input:focus-visible {
      outline-color: $basf_orange_4;
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
