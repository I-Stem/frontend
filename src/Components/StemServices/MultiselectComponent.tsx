import React, { useEffect, useState } from "react";
import MultiSelectDropDown from "@Components/StemServices/MultiselectDropdown";

const MultiSelectDropdownWrapper = (props: DropdownProps) => {
  const [showDropDown, setShowDropdown] = useState(false);
  const [itemList, setItemList] = useState([]);
  const {
    getDropdownListItems,
    id,
    setSelectedOrTypedInputValue,
    initialDropdownValue,
    required,
    name,
    label,
  } = props;
  useEffect(() => {
    getDropdownListItems().then((result: any) => {
      if (Array.isArray(result?.data)) setItemList(result.data);
      else setItemList([]);
      setShowDropdown(true);
    });
  }, []);

  return (
    <div>
      {showDropDown ? (
        <MultiSelectDropDown
          items={itemList.map((item: any) => {
            return item.name;
          })}
          handleSelectedItemChange={(selectedItem: any) => {
            setSelectedOrTypedInputValue(selectedItem);
          }}
          id={id}
          name={name}
          required={required}
          value={initialDropdownValue}
          updateValue={setSelectedOrTypedInputValue}
          label={label}
          onChange={props.onChange}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default MultiSelectDropdownWrapper;

interface DropdownProps {
  getDropdownListItems: () => Promise<{ name: string }>;
  setSelectedOrTypedInputValue: Function;
  name: string;
  id: string;
  required?: boolean;
  initialDropdownValue?: string | undefined;
  label?: string;
  onChange?: Function;
}
