/* USER CODE BEGIN Header */
/**
  ******************************************************************************
  * @file           : main.c
  * @brief          : Main program body
  ******************************************************************************
  * @attention
  *
  * Copyright (c) 2026 STMicroelectronics.
  * All rights reserved.
  *
  * This software is licensed under terms that can be found in the LICENSE file
  * in the root directory of this software component.
  * If no LICENSE file comes with this software, it is provided AS-IS.
  *
  ******************************************************************************
  */
/* USER CODE END Header */
/* Includes ------------------------------------------------------------------*/
#include "main.h"
#include "cmsis_os.h"

/* Private includes ----------------------------------------------------------*/
/* USER CODE BEGIN Includes */
#include "socket.h"
#include "w5500.h"
#include "wizchip_conf.h"
#include "loopback.h"
#include <string.h>
#include <stdio.h>
/* USER CODE END Includes */

/* Private typedef -----------------------------------------------------------*/
/* USER CODE BEGIN PTD */

/* USER CODE END PTD */

/* Private define ------------------------------------------------------------*/
/* USER CODE BEGIN PD */
#define SOCK_GET   0
#define SOCK_POST  1
#define SERVER_PORT 8000
#define GET_INTERVAL_MS 3000
#define SEQ_TIMEOUT     4000
#define RESET_DELAY     2000
#define DEBOUNCE_MS 20

/* USER CODE END PD */

/* Private macro -------------------------------------------------------------*/
/* USER CODE BEGIN PM */

/* USER CODE END PM */

/* Private variables ---------------------------------------------------------*/
SPI_HandleTypeDef hspi1;

UART_HandleTypeDef huart2;

/* Definitions for defaultTask */
osThreadId_t defaultTaskHandle;
const osThreadAttr_t defaultTask_attributes = {
  .name = "defaultTask",
  .stack_size = 128 * 4,
  .priority = (osPriority_t) osPriorityNormal,
};
/* USER CODE BEGIN PV */
typedef enum { VEHICLE_ENTRY, VEHICLE_EXIT } VehicleEvent;
osMessageQueueId_t vehicleQueueHandle;
osThreadId_t loopTaskHandle;
osThreadId_t httpTaskHandle;

wiz_NetInfo netInfo ={ .mac={0x00,0x08,0xdc,0xab,0xcd,0xef},
    		  	  	   .ip ={192,168,1,158},
  					   .sn ={255,255,255,0},
  					   .gw ={192,168,1,1},
  					   .dns = {8, 8, 8, 8}};

wiz_NetInfo readInfo;

uint8_t server_ip[4] = {192, 168, 1, 124};


uint8_t loopADetected = 0;
uint8_t loopBDetected = 0;
uint8_t sequenceComplete = 0;

uint32_t detectionTimestamp = 0;
uint32_t lastSequenceResetTime = 0;
uint32_t boomPollTick = 0;


/* USER CODE END PV */

/* Private function prototypes -----------------------------------------------*/
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_SPI1_Init(void);
static void MX_USART2_UART_Init(void);
void StartDefaultTask(void *argument);

/* USER CODE BEGIN PFP */

/* USER CODE END PFP */

/* Private user code ---------------------------------------------------------*/
/* USER CODE BEGIN 0 */
int __io_putchar(int ch){
   HAL_UART_Transmit(&huart2,(uint8_t*)&ch,1,HAL_MAX_DELAY);
   return ch;
}

int _write(int file, char *ptr, int len)
{
    (void) file;
    int DataIdx;
    for (DataIdx = 0; DataIdx < len; DataIdx++)
     {
       ITM_SendChar(*ptr++);
     }
    return len;
}

void cs_sel(void)
{
    HAL_GPIO_WritePin(CS_Pin_GPIO_Port, CS_Pin_Pin, GPIO_PIN_RESET);
}

void cs_desel(void)
{
    HAL_GPIO_WritePin(CS_Pin_GPIO_Port, CS_Pin_Pin, GPIO_PIN_SET);
}

uint8_t spi_rb(void){
	uint8_t rbuf;
	HAL_SPI_Receive(&hspi1,&rbuf,1,100);
	return rbuf;
}

void spi_wb(uint8_t b){
	HAL_SPI_Transmit(&hspi1,&b,1,100);
}

void wizChipInit(){
	  reg_wizchip_cs_cbfunc(cs_sel,cs_desel);
	  reg_wizchip_spi_cbfunc(spi_rb,spi_wb);
	  uint8_t bufSize[8] = {2,2,2,2,2,2,2,2};
	  wizchip_init(bufSize,bufSize);
}

uint8_t checkLinkStatus(void){
	uint8_t phycfgr = getPHYCFGR();
	if(phycfgr & PHYCFGR_LNK_ON){
		return 1;
	}
	else{
		return 0;
	}
}

void resetSequence(void)
{
    loopADetected = 0;
    loopBDetected = 0;
    detectionTimestamp = 0;
}


void trigger_relay(void)
{
    HAL_GPIO_WritePin(RL_Pin_GPIO_Port, RL_Pin_Pin, GPIO_PIN_RESET);
    HAL_Delay(300);
    HAL_GPIO_WritePin(RL_Pin_GPIO_Port, RL_Pin_Pin, GPIO_PIN_SET);
}


void http_get_boomsig(void)
{
    uint8_t rxBuf[512];
    memset(rxBuf, 0, sizeof(rxBuf));

    const char getReq[] =
        "GET /check_boomsig?gate_id=1 HTTP/1.1\r\n"
        "Host: 192.168.1.124:8000\r\n"
        "Connection: close\r\n\r\n";

    socket(SOCK_GET, Sn_MR_TCP, 5000, 0);

    if (connect(SOCK_GET, server_ip, SERVER_PORT) != SOCK_OK)
        goto close_socket;

    send(SOCK_GET, (uint8_t*)getReq, strlen(getReq));

    uint32_t start = HAL_GetTick();
    int total_len = 0;

    // Wait up to 2 seconds for response
    while (HAL_GetTick() - start < 2000)
    {
        int available = getSn_RX_RSR(SOCK_GET);
        if (available > 0)
        {
            int len = recv(SOCK_GET, rxBuf + total_len, sizeof(rxBuf) - 1 - total_len);
            if (len > 0)
            {
                total_len += len;
                rxBuf[total_len] = '\0';
            }
        }
    }

    if (total_len > 0)
    {
        printf("HTTP RESP:\n%s\n", rxBuf);

        // Find start of JSON body
        char *body = strstr((char*)rxBuf, "\r\n\r\n");
        if (body)
            body += 4;  // skip \r\n\r\n

        if (body && strstr(body, "\"command\":\"|OPENEN%\""))
        {
            trigger_relay(); // ✅ open gate
        }
    }

close_socket:
    disconnect(SOCK_GET);
    close(SOCK_GET);
}

/* ================= HTTP POST ================= */
void http_post_vehicle_event(const char *event)
{
    char body[128];
    char txBuf[512];
    uint8_t rxBuf[256];

    /* ---------- JSON BODY ---------- */
    sprintf(body,
            "{\"gate_id\":\"1\",\"event\":\"%s\"}",
            event);

    int bodyLen = strlen(body);

    /* ---------- HTTP REQUEST ---------- */
    sprintf(txBuf,
            "POST /vehicle_data HTTP/1.1\r\n"
            "Host: 192.168.1.124:8000\r\n"
            "Content-Type: application/json\r\n"
            "Content-Length: %d\r\n"
            "Connection: close\r\n\r\n"
            "%s",
            bodyLen,
            body);

    /* ---------- SOCKET CLEANUP ---------- */
    close(SOCK_POST);

    if (socket(SOCK_POST, Sn_MR_TCP, 5001, 0) != SOCK_OK)
    {
        printf("POST socket open failed\r\n");
        return;
    }

    if (connect(SOCK_POST, server_ip, SERVER_PORT) != SOCK_OK)
    {
        printf("POST connect failed\r\n");
        close(SOCK_POST);
        return;
    }

    int sent = send(SOCK_POST, (uint8_t*)txBuf, strlen(txBuf));
    if (sent <= 0)
    {
        printf("POST send failed\r\n");
        goto close_socket;
    }

    /* ---------- WAIT FOR RESPONSE ---------- */
    HAL_Delay(50);

close_socket:
    disconnect(SOCK_POST);
    close(SOCK_POST);
}


/* Loop Detection Task */
void LoopTask(void *argument)
{
    (void) argument;
    for(;;)
    {
        uint32_t now = HAL_GetTick();

        uint8_t loopAState = (HAL_GPIO_ReadPin(Loop1_Pin_GPIO_Port, Loop1_Pin_Pin) == GPIO_PIN_RESET);
        uint8_t loopBState = (HAL_GPIO_ReadPin(Loop2_Pin_GPIO_Port, Loop2_Pin_Pin) == GPIO_PIN_RESET);

        if (sequenceComplete)
        {
            if (!loopAState && !loopBState &&
                (now - lastSequenceResetTime > RESET_DELAY))
            {
                resetSequence();
                sequenceComplete = 0;
            }
            osDelay(5);
            continue;
        }

        if (loopAState && !loopADetected && !loopBDetected && !loopBState)
        {
            loopADetected = 1;
            detectionTimestamp = now;
            osDelay(5);
            continue;
        }

        if (loopBState && !loopBDetected && !loopADetected && !loopAState)
        {
            loopBDetected = 1;
            detectionTimestamp = now;
            osDelay(5);
            continue;
        }

        if (loopAState && loopBState)
        {
            osDelay(5);
            continue;
        }

        if ((loopADetected || loopBDetected) &&
            (now - detectionTimestamp > SEQ_TIMEOUT))
        {
            resetSequence();
            osDelay(5);
            continue;
        }

        if (loopADetected && !loopBDetected &&
            !loopAState && loopBState)
        {
            VehicleEvent ev = VEHICLE_ENTRY;
            osMessageQueuePut(vehicleQueueHandle, &ev, 0, 0);
            sequenceComplete = 1;
            lastSequenceResetTime = now;
            resetSequence();
        }

        if (loopBDetected && !loopADetected &&
            !loopBState && loopAState)
        {
            VehicleEvent ev = VEHICLE_EXIT;
            osMessageQueuePut(vehicleQueueHandle, &ev, 0, 0);
            sequenceComplete = 1;
            lastSequenceResetTime = now;
            resetSequence();
        }

        osDelay(5);
    }
}

void HttpTask(void *argument)
{
    (void) argument;
    VehicleEvent ev;
    uint32_t lastBoomPoll = 0;

    for(;;)
    {
        while(osMessageQueueGet(vehicleQueueHandle, &ev, NULL, 0) == osOK)
        {
            if (ev == VEHICLE_ENTRY) http_post_vehicle_event("entry");
            else if (ev == VEHICLE_EXIT) http_post_vehicle_event("exit");
        }

        uint32_t now = HAL_GetTick();
        if (now - lastBoomPoll >= GET_INTERVAL_MS)
        {
            lastBoomPoll = now;
            http_get_boomsig();
        }

        osDelay(10);
    }
}

/* USER CODE END 0 */

/**
  * @brief  The application entry point.
  * @retval int
  */
int main(void)
{

  /* USER CODE BEGIN 1 */

  /* USER CODE END 1 */

  /* MCU Configuration--------------------------------------------------------*/

  /* Reset of all peripherals, Initializes the Flash interface and the Systick. */
  HAL_Init();

  /* USER CODE BEGIN Init */

  /* USER CODE END Init */

  /* Configure the system clock */
  SystemClock_Config();

  /* USER CODE BEGIN SysInit */

  /* USER CODE END SysInit */

  /* Initialize all configured peripherals */
  MX_GPIO_Init();
  MX_SPI1_Init();
  MX_USART2_UART_Init();
  /* USER CODE BEGIN 2 */
  wizChipInit();
  HAL_Delay(500);
  wizchip_setnetinfo(&netInfo);
  HAL_Delay(500);
  wizchip_getnetinfo(&readInfo);
  /* USER CODE END 2 */
  /* Create vehicle event queue */
     vehicleQueueHandle = osMessageQueueNew(8, sizeof(VehicleEvent), NULL);

     /* Create tasks */
     const osThreadAttr_t loopTask_attributes = {
         .name = "LoopTask",
         .stack_size = 256*4,
         .priority = osPriorityHigh,
     };
     loopTaskHandle = osThreadNew(LoopTask, NULL, &loopTask_attributes);

     const osThreadAttr_t httpTask_attributes = {
         .name = "HttpTask",
         .stack_size = 512*4,
         .priority = osPriorityNormal,
     };
     httpTaskHandle = osThreadNew(HttpTask, NULL, &httpTask_attributes);

  /* Init scheduler */
    osKernelInitialize();
    osKernelStart();
  /* USER CODE BEGIN RTOS_MUTEX */
  /* add mutexes, ... */
  /* USER CODE END RTOS_MUTEX */

  /* USER CODE BEGIN RTOS_SEMAPHORES */
  /* add semaphores, ... */
  /* USER CODE END RTOS_SEMAPHORES */

  /* USER CODE BEGIN RTOS_TIMERS */
  /* start timers, add new ones, ... */
  /* USER CODE END RTOS_TIMERS */

  /* USER CODE BEGIN RTOS_QUEUES */
  /* add queues, ... */
  /* USER CODE END RTOS_QUEUES */

  /* Create the thread(s) */
  /* creation of defaultTask */
  defaultTaskHandle = osThreadNew(StartDefaultTask, NULL, &defaultTask_attributes);

  /* USER CODE BEGIN RTOS_THREADS */
  /* add threads, ... */
  /* USER CODE END RTOS_THREADS */

  /* USER CODE BEGIN RTOS_EVENTS */
  /* add events, ... */
  /* USER CODE END RTOS_EVENTS */

  /* Start scheduler */
  osKernelStart();

  /* We should never get here as control is now taken by the scheduler */

  /* Infinite loop */
  /* USER CODE BEGIN WHILE */
  while (1)
  {
    /* USER CODE END WHILE */

    /* USER CODE BEGIN 3 */
	  //checkLoopSequence();
	  //if (HAL_GetTick() - boomPollTick >= GET_INTERVAL_MS)
	 // {
	    // boomPollTick = HAL_GetTick();
	     // http_get_boomsig();
	  //}

  }
  /* USER CODE END 3 */
}

/**
  * @brief System Clock Configuration
  * @retval None
  */
void SystemClock_Config(void)
{
  RCC_OscInitTypeDef RCC_OscInitStruct = {0};
  RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};

  /** Configure the main internal regulator output voltage
  */
  __HAL_RCC_PWR_CLK_ENABLE();
  __HAL_PWR_VOLTAGESCALING_CONFIG(PWR_REGULATOR_VOLTAGE_SCALE2);

  /** Initializes the RCC Oscillators according to the specified parameters
  * in the RCC_OscInitTypeDef structure.
  */
  RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSI;
  RCC_OscInitStruct.HSIState = RCC_HSI_ON;
  RCC_OscInitStruct.HSICalibrationValue = RCC_HSICALIBRATION_DEFAULT;
  RCC_OscInitStruct.PLL.PLLState = RCC_PLL_ON;
  RCC_OscInitStruct.PLL.PLLSource = RCC_PLLSOURCE_HSI;
  RCC_OscInitStruct.PLL.PLLM = 8;
  RCC_OscInitStruct.PLL.PLLN = 50;
  RCC_OscInitStruct.PLL.PLLP = RCC_PLLP_DIV2;
  RCC_OscInitStruct.PLL.PLLQ = 4;
  if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK)
  {
    Error_Handler();
  }

  /** Initializes the CPU, AHB and APB buses clocks
  */
  RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK|RCC_CLOCKTYPE_SYSCLK
                              |RCC_CLOCKTYPE_PCLK1|RCC_CLOCKTYPE_PCLK2;
  RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_PLLCLK;
  RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
  RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV2;
  RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV1;

  if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_1) != HAL_OK)
  {
    Error_Handler();
  }
}

/**
  * @brief SPI1 Initialization Function
  * @param None
  * @retval None
  */
static void MX_SPI1_Init(void)
{

  /* USER CODE BEGIN SPI1_Init 0 */

  /* USER CODE END SPI1_Init 0 */

  /* USER CODE BEGIN SPI1_Init 1 */

  /* USER CODE END SPI1_Init 1 */
  /* SPI1 parameter configuration*/
  hspi1.Instance = SPI1;
  hspi1.Init.Mode = SPI_MODE_MASTER;
  hspi1.Init.Direction = SPI_DIRECTION_2LINES;
  hspi1.Init.DataSize = SPI_DATASIZE_8BIT;
  hspi1.Init.CLKPolarity = SPI_POLARITY_LOW;
  hspi1.Init.CLKPhase = SPI_PHASE_1EDGE;
  hspi1.Init.NSS = SPI_NSS_SOFT;
  hspi1.Init.BaudRatePrescaler = SPI_BAUDRATEPRESCALER_2;
  hspi1.Init.FirstBit = SPI_FIRSTBIT_MSB;
  hspi1.Init.TIMode = SPI_TIMODE_DISABLE;
  hspi1.Init.CRCCalculation = SPI_CRCCALCULATION_DISABLE;
  hspi1.Init.CRCPolynomial = 10;
  if (HAL_SPI_Init(&hspi1) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN SPI1_Init 2 */

  /* USER CODE END SPI1_Init 2 */

}

/**
  * @brief USART2 Initialization Function
  * @param None
  * @retval None
  */
static void MX_USART2_UART_Init(void)
{

  /* USER CODE BEGIN USART2_Init 0 */

  /* USER CODE END USART2_Init 0 */

  /* USER CODE BEGIN USART2_Init 1 */

  /* USER CODE END USART2_Init 1 */
  huart2.Instance = USART2;
  huart2.Init.BaudRate = 115200;
  huart2.Init.WordLength = UART_WORDLENGTH_8B;
  huart2.Init.StopBits = UART_STOPBITS_1;
  huart2.Init.Parity = UART_PARITY_NONE;
  huart2.Init.Mode = UART_MODE_TX_RX;
  huart2.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart2.Init.OverSampling = UART_OVERSAMPLING_16;
  if (HAL_UART_Init(&huart2) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN USART2_Init 2 */

  /* USER CODE END USART2_Init 2 */

}

/**
  * @brief GPIO Initialization Function
  * @param None
  * @retval None
  */
static void MX_GPIO_Init(void)
{
  GPIO_InitTypeDef GPIO_InitStruct = {0};
  /* USER CODE BEGIN MX_GPIO_Init_1 */

  /* USER CODE END MX_GPIO_Init_1 */

  /* GPIO Ports Clock Enable */
  __HAL_RCC_GPIOA_CLK_ENABLE();
  __HAL_RCC_GPIOC_CLK_ENABLE();
  __HAL_RCC_GPIOD_CLK_ENABLE();
  __HAL_RCC_GPIOB_CLK_ENABLE();

  /*Configure GPIO pin Output Level */
  HAL_GPIO_WritePin(RL_Pin_GPIO_Port, RL_Pin_Pin, GPIO_PIN_RESET);

  /*Configure GPIO pin Output Level */
  HAL_GPIO_WritePin(LED_Pin_GPIO_Port, LED_Pin_Pin, GPIO_PIN_RESET);

  /*Configure GPIO pin Output Level */
  HAL_GPIO_WritePin(CS_Pin_GPIO_Port, CS_Pin_Pin, GPIO_PIN_RESET);

  /*Configure GPIO pins : Loop2_Pin_Pin Loop1_Pin_Pin */
  GPIO_InitStruct.Pin = Loop2_Pin_Pin|Loop1_Pin_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
  GPIO_InitStruct.Pull = GPIO_PULLUP;
  HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);

  /*Configure GPIO pin : RL_Pin_Pin */
  GPIO_InitStruct.Pin = RL_Pin_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(RL_Pin_GPIO_Port, &GPIO_InitStruct);

  /*Configure GPIO pin : LED_Pin_Pin */
  GPIO_InitStruct.Pin = LED_Pin_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(LED_Pin_GPIO_Port, &GPIO_InitStruct);

  /*Configure GPIO pin : CS_Pin_Pin */
  GPIO_InitStruct.Pin = CS_Pin_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(CS_Pin_GPIO_Port, &GPIO_InitStruct);

  /* USER CODE BEGIN MX_GPIO_Init_2 */
  HAL_GPIO_WritePin(RL_Pin_GPIO_Port, RL_Pin_Pin, GPIO_PIN_SET);
  /* USER CODE END MX_GPIO_Init_2 */
}

/* USER CODE BEGIN 4 */

/* USER CODE END 4 */

/* USER CODE BEGIN Header_StartDefaultTask */
/**
  * @brief  Function implementing the defaultTask thread.
  * @param  argument: Not used
  * @retval None
  */
/* USER CODE END Header_StartDefaultTask */
void StartDefaultTask(void *argument)
{
  /* USER CODE BEGIN 5 */
  /* Infinite loop */
  for(;;)
  {
    osDelay(1);
  }
  /* USER CODE END 5 */
}

/**
  * @brief  This function is executed in case of error occurrence.
  * @retval None
  */
void Error_Handler(void)
{
  /* USER CODE BEGIN Error_Handler_Debug */
  /* User can add his own implementation to report the HAL error return state */
  __disable_irq();
  while (1)
  {
  }
  /* USER CODE END Error_Handler_Debug */
}
#ifdef USE_FULL_ASSERT
/**
  * @brief  Reports the name of the source file and the source line number
  *         where the assert_param error has occurred.
  * @param  file: pointer to the source file name
  * @param  line: assert_param error line source number
  * @retval None
  */
void assert_failed(uint8_t *file, uint32_t line)
{
  /* USER CODE BEGIN 6 */
  /* User can add his own implementation to report the file name and line number,
     ex: printf("Wrong parameters value: file %s on line %d\r\n", file, line) */
  /* USER CODE END 6 */
}
#endif /* USE_FULL_ASSERT */
