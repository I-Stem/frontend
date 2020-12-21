import React, { useEffect, useState } from "react";
import { useCombobox } from "downshift";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
const DropDown = (props: any) => {
  const [inputItems, setInputItems] = useState(props.items);

  useEffect(() => {
    document
      .getElementsByClassName("downshift-menu")[0]
      ?.removeAttribute("role");
  }, []);


  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    onSelectedItemChange: props.handleSelectedItemChange,
    initialInputValue: props.value,
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        props.items.filter((item: string) =>
          item.toLowerCase().includes(inputValue!.toLowerCase())
        )
      );
      props.updateValue(inputValue);
    },
  });
/*
  useEffect(() => {
    setValue(props.value);
  }, []);
*/
  return (
    <div>
      <label {...getLabelProps()}>{props.label}</label> 
      <div className="downshift-div" {...getComboboxProps()}>
        <input
          className="downshift-input"
          {...getInputProps()}
          name={props.name}
          required={props.required}
          id={props.id}
        />
        <button
          className="downshift-toggle-button"
          aria-hidden="true"
          type="button"
          {...getToggleButtonProps()}
        >
          <ArrowDropDown />
        </button>
      </div>
      <ul className="downshift-menu" role="none" aria-live="off" {...getMenuProps()}>
        {isOpen &&
          inputItems.map((item: any, index: number) => (
            <li
              className="downshift-item"
              style={
                highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}
              }
              key={`${item}${index}`}
              {...getItemProps({ item, index })}
            >
              {item}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default DropDown;
