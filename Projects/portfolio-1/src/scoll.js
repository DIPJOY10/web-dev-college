import $ from "jquery";
var sections = $("section");
console.log(sections);

export default function handleChange(_event, direction) {
  var active_section;

  active_section = $(this);
  if (direction === "up") active_section = active_section.prev();

  var active_link = $(
    '.navbar__contents a[href="#' + active_section.attr("id") + '"]'
  );

  active_link.addClass("active");
}
