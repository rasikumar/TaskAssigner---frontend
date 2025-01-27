/* eslint-disable react/prop-types */
import Selector from "./customUi/Selector";

export const SubCategory = ({
  subCategories,
  selected,
  onChange,
  disabled,
}) => (
  <Selector
    label="Sub Category"
    id="sub_category"
    value={selected}
    onChange={(e) => onChange(e.target.value)}
    options={subCategories.map((sub) => ({
      value: sub,
      label: sub,
    }))}
    disabled={disabled}
  />
);
