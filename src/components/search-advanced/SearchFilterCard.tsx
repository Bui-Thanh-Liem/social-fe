import { useAddQuery } from "~/hooks/useAddQuery";
import { cn } from "~/lib/utils";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItemMain } from "../ui/radio-group";
import { useRemoveQuery } from "~/hooks/useRemoveQuery";

export function SearchFilterCard() {
  const addQuery = useAddQuery();
  const removeQuery = useRemoveQuery();

  const handleChange = (value: string) => {
    if (value === "off") return removeQuery("pf");
    addQuery({ pf: value });
  };

  return (
    <Card className={cn("w-full rounded-2xl py-0 pt-2 overflow-hidden gap-2")}>
      <CardContent className="px-4 pb-4">
        <div>
          <h3 className="font-bold mb-3">Mọi người</h3>
          <RadioGroup defaultValue="off" onValueChange={handleChange}>
            <div className="flex items-center justify-between">
              <Label htmlFor="off" className="cursor-pointer flex-1">
                Từ bất kỳ ai
              </Label>
              <RadioGroupItemMain value="off" id="off" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="on" className="cursor-pointer flex-1">
                Những người bạn theo dõi
              </Label>
              <RadioGroupItemMain value="on" id="on" />
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
