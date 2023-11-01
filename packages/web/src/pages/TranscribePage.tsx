import React, { useCallback, useMemo, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import ButtonCopy from '../components/ButtonCopy';
import useTranscribe from '../hooks/useTranscribe';
import Markdown from '../components/Markdown';

const TranscribePage: React.FC = () => {
  const { loading, transcriptData, file, setFile, transcribe, clear } =
    useTranscribe();
  const ref = useRef<HTMLInputElement>(null);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const disabledExec = useMemo(() => {
    return !file || loading;
  }, [file, loading]);

  const onClickExec = useCallback(() => {
    if (loading) return;
    transcribe();
  }, [transcribe, loading]);

  const onClickClear = useCallback(() => {
    if (ref.current) {
      ref.current.value = '';
    }
    clear();
  }, [clear]);

  return (
    <div className="grid grid-cols-12">
      <div className="invisible col-span-12 my-0 flex h-0 items-center justify-center text-xl font-semibold lg:visible lg:my-5 lg:h-min">
        音声認識
      </div>
      <div className="col-span-12 col-start-1 mx-2 lg:col-span-10 lg:col-start-2 xl:col-span-10 xl:col-start-2">
        <Card label="ファイルアップロード">
          <input
            className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50
            text-sm text-gray-900 file:mr-4 file:border-0 file:px-4 file:py-2 file:font-semibold
            file:text-gray-700 focus:outline-none
            dark:border-gray-600 dark:bg-gray-700
            dark:text-gray-400 dark:placeholder:text-gray-400"
            onChange={onChangeFile}
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            accept=".mp3, .mp4, .wav, .flac, .ogg, .amr, .webm"
            ref={ref}></input>
          <p
            className="mt-1 text-sm text-gray-500 dark:text-gray-300"
            id="file_input_help">
            mp3, mp4, wav, flac, ogg, amr, webm ファイルが利用可能です
          </p>
          <div className="flex justify-end gap-3">
            <Button outlined disabled={disabledExec} onClick={onClickClear}>
              クリア
            </Button>
            <Button disabled={disabledExec} onClick={onClickExec}>
              実行
            </Button>
          </div>
          <div className="mt-5 rounded border border-black/30 p-1.5">
            {transcriptData && transcriptData.transcript && (
              <Markdown>{transcriptData.transcript}</Markdown>
            )}
            {!loading && !transcriptData?.transcript && (
              <div className="text-gray-500">
                音声認識結果がここに表示されます
              </div>
            )}
            {loading && (
              <div className="border-aws-sky h-5 w-5 animate-spin rounded-full border-4 border-t-transparent"></div>
            )}
            <div className="flex w-full justify-end">
              {transcriptData && transcriptData.transcript && (
                <ButtonCopy text={transcriptData.transcript}></ButtonCopy>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TranscribePage;