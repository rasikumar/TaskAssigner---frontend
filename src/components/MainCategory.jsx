/* eslint-disable react/prop-types */
import Selector from "./customUi/Selector";

export const MainCategory = ({ categories, selected, onChange }) => (
  <Selector
    label="Main Category"
    id="main_category"
    value={selected}
    onChange={onChange}
    options={Object.keys(categories).map((cat) => ({
      value: cat,
      label: cat,
    }))}
  />
);
