import React from "react";
import { Checkbox } from "../../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";

export default function Sidebar() {
  return (
    <aside className="w-64 p-4 bg-white rounded-md shadow-md">
      <h2 className="font-semibold mb-2">Category</h2>
      <div className="space-y-2 text-sm text-gray-700">
        <Label className="flex items-center space-x-2 cursor-pointer">
          <Checkbox />
          <span>All Product</span>
          <span className="ml-auto bg-gray-200 rounded-full px-2 text-xs">30</span>
        </Label>
        <Label className="flex items-center space-x-2 cursor-pointer">
          <Checkbox />
          <span>For Home</span>
        </Label>
        <Label className="flex items-center space-x-2 cursor-pointer">
          <Checkbox />
          <span>For Music</span>
        </Label>
        <Label className="flex items-center space-x-2 cursor-pointer">
          <Checkbox />
          <span>For Phone</span>
        </Label>
        <Label className="flex items-center space-x-2 cursor-pointer">
          <Checkbox />
          <span>For Storage</span>
        </Label>
      </div>

      <h2 className="font-semibold mt-6 mb-2">Filter</h2>
      <RadioGroup defaultValue="new-arrival" className="space-y-2 text-sm text-gray-700">
        <Label className="flex items-center space-x-2 cursor-pointer">
          <RadioGroupItem value="new-arrival" />
          <span>New Arrival</span>
        </Label>
        <Label className="flex items-center space-x-2 cursor-pointer">
          <RadioGroupItem value="best-seller" />
          <span>Best Seller</span>
        </Label>
        <Label className="flex items-center space-x-2 cursor-pointer">
          <RadioGroupItem value="on-discount" />
          <span>On Discount</span>
        </Label>
      </RadioGroup>
    </aside>
  );
}
