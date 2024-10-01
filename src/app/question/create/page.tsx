"use client";

import { CreateQuestion, type CreateQuestionParams } from "@/api/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaHome } from "react-icons/fa";
import { getData } from "./editor";

// const Editor = dynamic(() => import("./editor"), { ssr: false });

const Create = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<CreateQuestionParams>();

  const [sampleInputs, setSampleInputs] = useState<string[]>([""]);
  const [sampleOutputs, setSampleOutputs] = useState<string[]>([""]);
  const [explanations, setExplanations] = useState<string[]>([""]);
  const [inputFormats, setInputFormats] = useState<string[]>([""]);

  const createQuestion = useMutation({
    mutationFn: async (data: CreateQuestionParams) => {
      const markdown = await getData();
      if (markdown) {
        data.description = markdown;
      }
      data.input_format = inputFormats;
      data.points = +data.points;
      data.round = +data.round;
      data.constraints = data.constraints?.[0]?.split("\n") ?? [];
      data.output_format = data.output_format?.[0]?.split("\n") ?? [];
      data.sample_test_input = sampleInputs;
      data.sample_test_output = sampleOutputs;
      data.sample_explanation = explanations;

      return toast.promise(CreateQuestion(data), {
        loading: "Adding Question",
        success: "Success!",
        error: (err: ApiError) => err.message,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["questions"] });
      reset();
      router.push("/question");
    },
    onError: () => {
      console.log("Error occurred while creating the question");
    },
  });

  const onSubmit = (data: CreateQuestionParams) => {
    createQuestion.mutate(data);
  };

  const addSampleInput = () => {
    setSampleInputs([...sampleInputs, ""]);
  };

  const addSampleOutput = () => {
    setSampleOutputs([...sampleOutputs, ""]);
  };

  const addExplanation = () => {
    setExplanations([...explanations, ""]);
  };

  const addInputFormat = () => {
    setInputFormats([...inputFormats, ""]);
  };

  const handleInputChange = (index: number, value: string, type: string) => {
    if (type === "input") {
      const newInputs = [...sampleInputs];
      newInputs[index] = value;
      setSampleInputs(newInputs);
    } else if (type === "output") {
      const newOutputs = [...sampleOutputs];
      newOutputs[index] = value;
      setSampleOutputs(newOutputs);
    } else if (type === "explanation") {
      const newExplanations = [...explanations];
      newExplanations[index] = value;
      setExplanations(newExplanations);
    } else if (type === "format") {
      const newFormats = [...inputFormats];
      newFormats[index] = value;
      setInputFormats(newFormats);
    }
  };

  const deleteEntry = (index: number, type: string) => {
    if (type === "input") {
      setSampleInputs(sampleInputs.filter((_, i) => i !== index));
    } else if (type === "output") {
      setSampleOutputs(sampleOutputs.filter((_, i) => i !== index));
    } else if (type === "explanation") {
      setExplanations(explanations.filter((_, i) => i !== index));
    } else if (type === "format") {
      setInputFormats(inputFormats.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="m-10 space-y-10 text-white">
      <div className="flex items-center">
        <Button
          onClick={() => {
            router.push("/dashboard");
          }}
          className="bg-bb hover:bg-slate-950"
        >
          <FaHome size={20} className="text-white" />
        </Button>
        <h1 className="flex-grow text-center text-2xl font-bold text-accent">
          Add Questions
        </h1>
      </div>
      <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="title"
            className="text-right text-lg font-bold text-primary"
          >
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
          <Label
            htmlFor="description"
            className="col-span-1 text-right text-lg font-bold text-primary"
          >
            Description
          </Label>
          {/* <Editor /> */}
          <Textarea
            id="description"
            placeholder="teri-mummy"
            className="col-span-3"
            {...register("description")}
            rows={50}
          ></Textarea>
        </div>

        {/* Input Format Section */}
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="flex flex-row items-center gap-2">
            <Label
              htmlFor="input_format"
              className="col-span-3 whitespace-nowrap text-right text-lg font-bold text-primary"
            >
              Input Format
            </Label>
            <Button type="button" onClick={addInputFormat}>
              +
            </Button>
          </div>
          <div className="col-span-3 flex w-full flex-col">
            {inputFormats.map((format, index) => (
              <div key={index} className="flex items-center gap-2">
                <Textarea
                  value={format}
                  placeholder="3 integers"
                  className="col-span-3"
                  onChange={(e) =>
                    handleInputChange(index, e.target.value, "format")
                  }
                />
                <Button
                  type="button"
                  onClick={() => deleteEntry(index, "format")}
                  className="text-red-500"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="points"
            className="text-right text-lg font-bold text-primary"
          >
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
          <Label
            htmlFor="round"
            className="text-right text-lg font-bold text-primary"
          >
            Round
          </Label>
          <select
            {...register("round")}
            defaultValue={1}
            id="round"
            className="col-span-3 rounded-md border bg-gray-200 p-2 text-black"
          >
            <option value={0}>Round 0</option>
            <option value={1}>Round 1</option>
            <option value={2}>Round 2</option>
            <option value={3}>Round 3</option>
          </select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="constraints"
            className="text-right text-lg font-bold text-primary"
          >
            Constraints
          </Label>
          <Textarea
            id="constraints"
            placeholder="1 < x < 10"
            className="col-span-3"
            {...register("constraints.0")}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="output_format"
            className="text-right text-lg font-bold text-primary"
          >
            Output Format
          </Label>
          <Textarea
            id="output_format"
            placeholder="Number"
            className="col-span-3"
            {...register("output_format.0")}
          />
        </div>

        {/* Sample Test Output Section */}
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="flex flex-row items-center gap-2">
            <Label
              htmlFor="sample_test_output"
              className="whitespace-nowrap text-right text-lg font-bold text-primary"
            >
              Sample Test Output
            </Label>
            <Button type="button" onClick={addSampleOutput}>
              +
            </Button>
          </div>
          <div className="col-span-3 flex w-full flex-col">
            {sampleOutputs.map((output, index) => (
              <div key={index} className="flex items-center gap-2">
                <Textarea
                  value={output}
                  placeholder="Number"
                  className="w-full"
                  onChange={(e) =>
                    handleInputChange(index, e.target.value, "output")
                  }
                />
                <Button
                  type="button"
                  onClick={() => deleteEntry(index, "output")}
                  className="text-red-500"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Test Input Section */}
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="flex flex-row items-center gap-2">
            <Label
              htmlFor="sample_test_input"
              className="whitespace-nowrap text-right text-lg font-bold text-primary"
            >
              Sample Test Input
            </Label>
            <Button type="button" onClick={addSampleInput}>
              +
            </Button>
          </div>
          <div className="col-span-3 flex w-full flex-col">
            {sampleInputs.map((input, index) => (
              <div key={index} className="flex items-center gap-2">
                <Textarea
                  value={input}
                  placeholder="Input"
                  className="w-full"
                  onChange={(e) =>
                    handleInputChange(index, e.target.value, "input")
                  }
                />
                <Button
                  type="button"
                  onClick={() => deleteEntry(index, "input")}
                  className="text-red-500"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Explanation Section */}
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="flex flex-row items-center gap-2">
            <Label
              htmlFor="sample_explanation"
              className="whitespace-nowrap text-right text-lg font-bold text-primary"
            >
              Sample Explanation
            </Label>
            <Button type="button" onClick={addExplanation}>
              +
            </Button>
          </div>
          <div className="col-span-3 flex w-full flex-col">
            {explanations.map((explanation, index) => (
              <div key={index} className="flex items-center gap-2">
                <Textarea
                  value={explanation}
                  placeholder="Explanation"
                  className="w-full"
                  onChange={(e) =>
                    handleInputChange(index, e.target.value, "explanation")
                  }
                />
                <Button
                  type="button"
                  onClick={() => deleteEntry(index, "explanation")}
                  className="text-red-500"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="mt-4">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Create;
