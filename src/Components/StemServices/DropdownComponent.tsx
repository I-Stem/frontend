import React, { useEffect, useState } from "react";
import Dropdown from "@Components/StemServices/InternalDropdown";

const DropdownWrapper = (
  props: DropdownProps,
) => {
  const [showDropDown, setShowDropdown] = useState(false);
  const [itemList, setItemList] = useState([]);
  const { getDropdownListItems, id, setSelectedOrTypedInputValue, initialDropdownValue, required, name, label} = props;
  useEffect(() => {
    getDropdownListItems().then((result: any) => {
      if(Array.isArray(result?.data))
      setItemList(result.data);
      else
      setItemList([]);
      setShowDropdown(true);
    });
  }, []);
  
  return (
    <div>
      {showDropDown ? (
        <Dropdown
          items={itemList.map((item: any) => {
            return item.name;
          })}
          handleSelectedItemChange={(selectedItem:any) => setSelectedOrTypedInputValue(selectedItem.selectedItem)}
          id={id}
          name={name}
          required={required}
          value={initialDropdownValue}
          updateValue={setSelectedOrTypedInputValue}
          label={label}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default DropdownWrapper;

interface DropdownProps {
  getDropdownListItems: () => Promise<{name:string}>;
  setSelectedOrTypedInputValue: Function;
  name: string;
  id: string;
  required?: boolean;
  initialDropdownValue?: string | undefined;
  label?:string;
}
