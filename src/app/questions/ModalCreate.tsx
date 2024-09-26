import {
  CreateQuestion,
  CreateQuestionParams,
} from "@/api/questions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "next/dist/server/api-utils";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
// interface CreateButtonProps {
//     questions: QuestionResponse[];
//     setQuestions: React.Dispatch<React.SetStateAction<QuestionResponse[]>>;
//   }




const CreateButton = ({
    // setQuestions,
    children,
}: {
    // setQuestions: React.Dispatch<React.SetStateAction<QuestionResponse[]>>;
    children: React.ReactNode;
}) => {
    
    // const descriptionRef = useRef<HTMLInputElement>(null);
    // const titleRef = useRef<HTMLInputElement>(null);
    // const inputFormatRef = useRef<HTMLInputElement>(null);
    // const pointsRef = useRef<HTMLInputElement>(null);
    // const constraintsRef = useRef<HTMLInputElement>(null);
    // const outputFormatRef = useRef<HTMLInputElement>(null);
    // const [round, setRound] = useState("1");
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient()
    
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<CreateQuestionParams>({
    })

    const createQuestion = useMutation({
      mutationFn: (data: CreateQuestionParams) => {
        // reorder after u get docs
        let dataArr = [data.title, data.description, data.round, data.points, data.output_format, data.input_format, data.constraints,]
        return toast.promise(
            CreateQuestion(dataArr),
            {
              loading: "Adding Question",
              success: "Success!",
              error: (err: ApiError) => err.message,
            })},
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["questions"] })
        reset()
    
        setIsOpen(false)
      },
      onError: () => {
        }
        })
    
    
    
    const onSubmit = (data: CreateQuestionParams) => {
      createQuestion.mutate(data)
    }
    //   const handleQuestionSubmit = async (e: React.FormEvent) => {
        //     e.preventDefault();
        
        // //     const questionResponse: CreateQuestionParams = {
            // //       description: descriptionRef.current?.value ?? "",
            // //       title: titleRef.current?.value ?? "",
            // //       input_format: inputFormatRef.current?.value ?? "",
            // //       points: Number(pointsRef.current?.value) ?? 0,
            // //       round: Number(round) ?? 0,
            // //       constraints: constraintsRef.current?.value ?? "",
            // //       output_format: outputFormatRef.current?.value ?? "",
            // //     };
            // //     try {
// //       const newQuestion = await toast.promise(
// //         CreateQuestion(questionResponse),
// //         {
    // //           loading: "Adding Question",
    // //           success: "Sucess!",
    // //           error: (err: ApiError) => err.message,
    // //         },
    // //       );
    // //       setIsOpen(false);
    // //     } catch (err) {
// //       console.error("Couldn't add question:", err);
// //     }
//   };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-slate-800 text-orange-500 hover:bg-slate-600 hover:text-orange-600"
          variant="outline"
        >
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Question</DialogTitle>
          <DialogDescription>Add questions here</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                placeholder="OP Question"
                className="col-span-3"
                {...register("title")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discription" className="text-right">
                Discription
              </Label>
              <Input
                id="discription"
                placeholder="yada-yada"
                className="col-span-3"
                {...register("description")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="input_format" className="text-right">
                Input Format
              </Label>
              <Input
                id="input_format"
                placeholder="3 integers"
                className="col-span-3"
                {...register("input_format")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="points" className="text-right">
                Points
              </Label>
              <Input
                id="points"
                type="number"
                placeholder="30"
                className="col-span-3"
                {...register("points")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="round" className="text-right">
                Round
              </Label>
              <Select {...register("round")} >
              
              {/* <Select {...register("round")} onValueChange={(value) => setRound(value)}> */}
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Round" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="constrains" className="text-right">
                Constrains
              </Label>
              <Input
                id="constrains"
                placeholder="1 < x < 10"
                className="col-span-3"
                {...register("constraints")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="output_format" className="text-right">
                Output Format
              </Label>
              <Input
                id="output_format"
                placeholder="Number"
                className="col-span-3"
                {...register("output_format")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateButton;
