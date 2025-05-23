"use client";

import React, { useEffect, useState, useTransition, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Palette,
  MessageSquare,
  ChevronsUpDown,
  Check,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ListFilter,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Form, FormLabel } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { useColorSelection } from "@/hooks/use-color";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { createCakeMessage } from "@/features/ingredients/actions/cake-message-option-action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Enum definitions
enum CakeMessageTypeEnum {
  NONE = "NONE",
  TEXT = "TEXT",
  IMAGE = "IMAGE",
}

enum CakeMessageOptionTypeEnum {
  PIPING_COLOUR = "PIPING_COLOUR",
  PLAQUE_COLOUR = "PLAQUE_COLOUR",
}

// Tên hiển thị tiếng Việt cho các loại tin nhắn
const getTypeDisplayName = (type: string): string => {
  const typeNameMap: Record<string, string> = {
    PLAQUE_COLOUR: "Màu Thông Điệp",
    PIPING_COLOUR: "Màu Viền",
    TEXT: "Nội Dung",
    NONE: "Không",
    IMAGE: "Hình Ảnh",
  };

  return typeNameMap[type] || type;
};

// Simplified schema to match requested structure: [{type: string, name: string, color: string}]
const cakeMessageItemSchema = z.object({
  type: z.nativeEnum(CakeMessageTypeEnum),
  name: z.nativeEnum(CakeMessageOptionTypeEnum),
  color: z.object({
    displayName: z.string(),
    name: z.string(),
    hex: z.string(),
  }),
});

const collectionSchema = z.object({
  messages: z
    .array(cakeMessageItemSchema)
    .min(1, { message: "Thêm ít nhất 1 tin nhắn" }),
});

const CollectionCakeMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isOpenModal = isOpen && type === "collectionCakeMessageModal";
  const [isPending, startTransition] = useTransition();
  const { COLOR_OPTIONS, getColorValue } = useColorSelection();
  const [messageItems, setMessageItems] = useState<
    z.infer<typeof cakeMessageItemSchema>[]
  >([]);
  const [currentColorPopover, setCurrentColorPopover] =
    useState<boolean>(false);

  // Pagination state
  const [currentStep, setCurrentStep] = useState("form"); // "form", "summary"
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [currentItemValidated, setCurrentItemValidated] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [allItemsValid, setAllItemsValid] = useState(false);

  const form = useForm<z.infer<typeof collectionSchema>>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      messages: [],
    },
  });

  // Create a new empty message item
  const createEmptyItem = () => {
    return {
      type: CakeMessageTypeEnum.TEXT,
      name: CakeMessageOptionTypeEnum.PIPING_COLOUR,
      color: getColorValue("Black"),
    };
  };

  // Initialize with one empty item when the modal opens
  useEffect(() => {
    if (isOpenModal && messageItems.length === 0) {
      const newItem = createEmptyItem();
      setMessageItems([newItem]);
      form.setValue("messages", [newItem]);
    }
  }, [isOpenModal]);

  // Validate the current item
  const validateCurrentItem = () => {
    const currentItem = messageItems[currentItemIndex];

    // Check if currentItem exists
    if (!currentItem) {
      setCurrentItemValidated(false);
      return false;
    }

    // Validate all required fields
    const nameValid = !!currentItem.name;
    const colorValid = !!currentItem.color && !!currentItem.color.name;
    const typeValid = !!currentItem.type;

    // Get validation results
    const validationResults = {
      nameValid,
      colorValid,
      typeValid,
      allValid: nameValid && colorValid && typeValid,
    };

    setCurrentItemValidated(!!validationResults.allValid);
    return !!validationResults.allValid;
  };

  // Validate all items
  const validateAllItems = () => {
    if (messageItems.length === 0) {
      setAllItemsValid(false);
      return false;
    }

    const allValid = messageItems.every((item) => {
      const nameValid = !!item.name;
      const colorValid = !!item.color && !!item.color.name;
      const typeValid = !!item.type;

      return nameValid && colorValid && typeValid;
    });

    setAllItemsValid(allValid);
    return allValid;
  };

  useEffect(() => {
    validateCurrentItem();
    validateAllItems();
  }, [messageItems, currentItemIndex]);

  // Add a new item to the list and navigate to it
  const addNewItem = () => {
    const newItem = createEmptyItem();
    const newItems = [...messageItems, newItem];
    setMessageItems(newItems);
    form.setValue("messages", newItems);
    setCurrentItemIndex(newItems.length - 1);
    resetTouchedFields();
  };

  // Remove the current item
  const removeCurrentItem = () => {
    if (messageItems.length <= 1) return;

    const updatedItems = messageItems.filter((_, i) => i !== currentItemIndex);
    setMessageItems(updatedItems);
    form.setValue("messages", updatedItems);

    if (currentItemIndex >= updatedItems.length) {
      setCurrentItemIndex(updatedItems.length - 1);
    }
  };

  const updateCurrentItem = (field: string, value: any) => {
    const updatedItems = [...messageItems];
    if (updatedItems[currentItemIndex]) {
      updatedItems[currentItemIndex] = {
        ...updatedItems[currentItemIndex],
        [field]: value,
      };
      setMessageItems(updatedItems);
      form.setValue("messages", updatedItems);

      // Mark field as touched
      setTouchedFields((prev) => ({
        ...prev,
        [field]: true,
      }));
    }
  };

  // Check if field has been touched
  const isFieldTouched = (field: string) => {
    return touchedFields[field] === true;
  };

  // Reset touched fields when adding or switching items
  const resetTouchedFields = () => {
    setTouchedFields({});
  };

  const goToPrevItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
      resetTouchedFields();
    }
  };

  const goToNextItem = () => {
    if (currentItemIndex < messageItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      resetTouchedFields();
    }
  };

  const goToSummary = () => {
    if (messageItems.length > 0) {
      // Validate all items before proceeding to summary
      if (validateAllItems()) {
        setCurrentStep("summary");
      } else {
        toast.error("Vui lòng điền đầy đủ thông tin cho tất cả tin nhắn");
      }
    }
  };

  const backToForm = (index: number = currentItemIndex) => {
    setCurrentStep("form");
    setCurrentItemIndex(index);
  };

  const onSubmit = async (values: z.infer<typeof collectionSchema>) => {
    try {
      // Format the data for API submission to match the required structure
      const formattedItems = values.messages.map((item) => ({
        type: "TEXT", // Explicitly use string "TEXT" instead of enum value
        name: item.name,
        color: item.color.name,
      }));

      console.log("Submitted items:", formattedItems);

      startTransition(async () => {
        const result = await createCakeMessage(formattedItems);
        if (!result.success) {
          toast.error(result.error);
          return;
        } else {
          toast.success(
            `Đã thêm ${formattedItems.length} tin nhắn thành công!`
          );
        }

        handleClose();
      });
    } catch (error) {
      console.error("Error processing cake messages:", error);
      toast.error("Có lỗi xảy ra khi xử lý tin nhắn");
    }
  };

  const handleClose = () => {
    onClose();
    setMessageItems([]);
    setCurrentItemIndex(0);
    setCurrentStep("form");
    setCurrentItemValidated(false);
  };

  // Memoize the current item to prevent unnecessary rerenders
  const currentItem = useMemo(() => {
    return messageItems[currentItemIndex];
  }, [messageItems, currentItemIndex]);

  const renderItemForm = () => {
    if (!currentItem) {
      return (
        <div className="flex justify-center items-center p-8">
          <Button
            type="button"
            onClick={addNewItem}
            variant="outline"
            className="rounded-full px-3 bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700 hover:text-amber-800 transition-all flex items-center gap-1 flex-1"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm tin nhắn mới</span>
          </Button>
        </div>
      );
    }

    // Run validation for field-specific error messages
    const validation = {
      nameValid: !!currentItem.name,
      colorValid: !!currentItem.color && !!currentItem.color.name,
      typeValid: true, // Always valid because type is fixed
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              {currentItemIndex + 1} / {messageItems.length}
            </Badge>
            <h3 className="text-sm font-medium">
              Tin nhắn #{currentItemIndex + 1}
            </h3>
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={goToPrevItem}
              disabled={currentItemIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={goToNextItem}
              disabled={currentItemIndex === messageItems.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 ml-1"
              onClick={removeCurrentItem}
              disabled={messageItems.length <= 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <FormLabel className="flex items-center gap-2 text-sm">
              <MessageSquare className="w-4 h-4 text-primary" />
              Tên tin nhắn <span className="text-red-500">*</span>
            </FormLabel>
            <Select
              value={currentItem.name}
              onValueChange={(value) =>
                updateCurrentItem("name", value as CakeMessageOptionTypeEnum)
              }
              onOpenChange={() =>
                setTouchedFields((prev) => ({ ...prev, name: true }))
              }
            >
              <SelectTrigger
                className={cn(
                  "rounded-md h-9",
                  isFieldTouched("name") &&
                    !validation.nameValid &&
                    "border-red-500"
                )}
              >
                <SelectValue placeholder="Chọn tên tin nhắn" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(CakeMessageOptionTypeEnum).map((optionType) => (
                  <SelectItem key={optionType} value={optionType}>
                    {getTypeDisplayName(optionType)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isFieldTouched("name") && !validation.nameValid && (
              <p className="text-xs text-red-500">Vui lòng chọn tên tin nhắn</p>
            )}
          </div>

          {/* Type Field - Fixed to TEXT (Nội dung) */}
          <div className="space-y-1.5">
            <FormLabel className="flex items-center gap-2 text-sm">
              <MessageSquare className="w-4 h-4 text-primary" />
              Loại tin nhắn
            </FormLabel>
            <div className="flex items-center h-9 px-3 border border-indigo-100 rounded-md bg-gradient-to-r from-indigo-50/70 to-blue-50/70 shadow-sm">
              <span className="text-sm font-medium text-indigo-700">
                Nội dung
              </span>
            </div>
          </div>

          {/* Color Field */}
          <div className="space-y-1.5 col-span-2">
            <FormLabel className="flex items-center gap-2 text-sm text-gray-700">
              <Palette className="w-4 h-4 text-purple-500" />
              Màu sắc <span className="text-red-500">*</span>
            </FormLabel>
            <Popover
              open={currentColorPopover}
              onOpenChange={(open) => {
                setCurrentColorPopover(open);
                if (!open) {
                  setTouchedFields((prev) => ({ ...prev, color: true }));
                }
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between rounded-xl h-10 hover:bg-transparent",
                    isFieldTouched("color") &&
                      !validation.colorValid &&
                      "border-red-500"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: currentItem.color?.hex || "#000000",
                      }}
                    />
                    {currentItem.color?.name || "Black"} (
                    {currentItem.color?.hex || "#000000"})
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[300px]">
                <Command>
                  <CommandInput placeholder="Tìm màu..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy màu.</CommandEmpty>
                    <CommandGroup>
                      {COLOR_OPTIONS.map((color) => (
                        <CommandItem
                          key={color.hex}
                          value={color.name}
                          onSelect={() => {
                            updateCurrentItem("color", color);
                            setCurrentColorPopover(false);
                          }}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div
                              className="w-5 h-5 rounded-full border border-gray-200"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="text-sm">
                              {color.name} ({color.hex})
                            </span>
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              color.hex === currentItem.color?.hex
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {isFieldTouched("color") && !validation.colorValid && (
              <p className="text-xs text-red-500">Vui lòng chọn màu sắc</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render the summary view
  const renderSummary = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">
            Danh sách tin nhắn ({messageItems.length})
          </h3>
          <Button variant="outline" size="sm" onClick={() => backToForm()}>
            Chỉnh sửa
          </Button>
        </div>

        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {messageItems.map((item, index) => {
              const isItemValid =
                !!item.name && !!item.color && !!item.color.name && !!item.type;

              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer",
                    !isItemValid && "border-red-500 bg-red-50"
                  )}
                  onClick={() => backToForm(index)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: item.color?.hex || "#000000" }}
                    />
                    <div>
                      <div className="font-medium">
                        {getTypeDisplayName(item.name)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getTypeDisplayName(item.type)} -{" "}
                        {item.color?.name || "Black"}
                      </div>
                    </div>
                  </div>
                  {!isItemValid && (
                    <Badge variant="destructive" className="mr-2">
                      Thiếu thông tin
                    </Badge>
                  )}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    );
  };

  return (
    <Dialog open={isOpenModal} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl rounded-xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            {currentStep === "form"
              ? "Thêm Tin Nhắn"
              : "Xác nhận Thêm Tin Nhắn"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {currentStep === "form" ? renderItemForm() : renderSummary()}

            <div className="flex flex-col gap-2 pt-4">
              {currentStep === "form" && (
                <>
                  <div className="flex gap-2 w-full">
                    <Button
                      type="button"
                      onClick={addNewItem}
                      variant="outline"
                      className="rounded-full px-3 bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700 hover:text-amber-800 transition-all flex items-center gap-1 flex-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm tin nhắn mới</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={goToSummary}
                      disabled={!currentItemValidated}
                      className="rounded-full px-3 bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700 hover:text-amber-800 transition-all flex items-center gap-1 flex-1"
                    >
                      <ListFilter className="w-4 h-4" />
                      <span>Xem danh sách ({messageItems.length})</span>
                    </Button>
                  </div>
                </>
              )}

              {currentStep === "summary" && (
                <Button
                  type="submit"
                  className="rounded-full px-3 bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700 hover:text-amber-800 transition-all flex items-center gap-1 justify-center w-full"
                  disabled={
                    isPending || messageItems.length === 0 || !allItemsValid
                  }
                >
                  {isPending
                    ? "Đang xử lý..."
                    : !allItemsValid
                    ? "Một số tin nhắn chưa hoàn thành"
                    : `Xác nhận thêm ${messageItems.length} tin nhắn`}
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="rounded-full px-3 border-gray-200 hover:bg-gray-50 text-gray-700 transition-all w-full"
              >
                Hủy bỏ
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionCakeMessageModal;
