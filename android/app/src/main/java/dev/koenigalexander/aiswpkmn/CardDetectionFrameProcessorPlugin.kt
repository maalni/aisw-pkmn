package dev.koenigalexander.aiswpkmn

import ai.onnxruntime.OnnxTensor
import ai.onnxruntime.OrtEnvironment
import ai.onnxruntime.OrtSession
import android.content.res.Resources
import android.graphics.Bitmap
import android.util.Log
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy
import java.nio.FloatBuffer
import java.util.Collections


class CardDetectionFrameProcessorPlugin(proxy: VisionCameraProxy, options: Map<String, Any>?): FrameProcessorPlugin() {
    private var ortSession: OrtSession? = null

    companion object {
        const val TAG = "CardDetectionFrameProcessorPlugin"
        const val DIM_BATCH_SIZE = 1;
        const val DIM_PIXEL_SIZE = 3;
        const val IMAGE_SIZE_X = 640;
        const val IMAGE_SIZE_Y = 640;
    }

    init {
        val modelFilename = R.raw.pkmn

        try {
            Log.v(TAG, "Opening asset resource $modelFilename")
            val assetManager: Resources = proxy.context.resources
            val inputStream = assetManager.openRawResource(modelFilename)
            Log.v(TAG, "Opening asset resource successfully. Size=" + inputStream.available())

            val b = ByteArray(inputStream.available())
            inputStream.read(b)


            val ortEnvironment = OrtEnvironment.getEnvironment()
            ortSession = ortEnvironment.createSession(b)
            Log.v(TAG, "Created ort session")
        } catch (e: Exception) {
            // e.printStackTrace();
            Log.e(TAG, "Error: failed to open raw resource " + modelFilename + ". " + e.message)
        }
    }



    fun preProcess(bitmap: Bitmap): FloatBuffer {
        val imgData = FloatBuffer.allocate(
            DIM_BATCH_SIZE
                    * DIM_PIXEL_SIZE
                    * IMAGE_SIZE_X
                    * IMAGE_SIZE_Y
        )
        imgData.rewind()
        val stride = IMAGE_SIZE_X * IMAGE_SIZE_Y
        val bmpData = IntArray(stride)
        bitmap.getPixels(bmpData, 0, bitmap.width, 0, 0, bitmap.width, bitmap.height)
        for (i in 0..IMAGE_SIZE_X - 1) {
            for (j in 0..IMAGE_SIZE_Y - 1) {
                val idx = IMAGE_SIZE_Y * i + j
                val pixelValue = bmpData[idx]
                imgData.put(idx, (((pixelValue shr 16 and 0xFF) / 255f - 0.485f) / 0.229f))
                imgData.put(idx + stride, (((pixelValue shr 8 and 0xFF) / 255f - 0.456f) / 0.224f))
                imgData.put(idx + stride * 2, (((pixelValue and 0xFF) / 255f - 0.406f) / 0.225f))
            }
        }

        imgData.rewind()
        return imgData
    }

    override fun callback(frame: Frame, arguments: Map<String, Any>?): Any  {
        //you can use ORTsession in order to do you predictions
        val env = OrtEnvironment.getEnvironment()
        val inputName = ortSession!!.inputNames.iterator().next()
        Log.v(TAG, "Input name: " + inputName)

        val buffer: FloatBuffer = preProcess(frame.imageProxy.toBitmap())

        //this buffer is the input for your model, it's depend on your model and the requirements
        val inputTensor: OnnxTensor = OnnxTensor.createTensor(
            env,
            buffer,
            longArrayOf(DIM_BATCH_SIZE.toLong(), DIM_PIXEL_SIZE.toLong(), IMAGE_SIZE_X.toLong(), IMAGE_SIZE_Y.toLong())
        ) //this arguments depends on your onnx model
        val output = ortSession!!.run(Collections.singletonMap(inputName, inputTensor))

        //now you can use outputArray to create an output for JS side.
        //outputArray basically contains all your predictiosn from the model

        //final result which send back to JS side
        val result: MutableMap<String, String> = emptyMap<String, String>().toMutableMap()
        try {

            val outputTensor = output[0] as OnnxTensor
            Log.v(TAG, "outputTensor size: " + output.size())
            val testo = outputTensor.getValue() as Array<Array<FloatArray>>

            result["key"] = testo[]
        } catch (e: java.lang.Exception) {
            result["errorKey"] = e.localizedMessage
        }

        return result.toMap()
    }
}